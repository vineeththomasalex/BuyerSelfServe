import React, { createContext, useCallback, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '../utils/generateId';
import { phases } from '../data/phases';
import { stages } from '../data/stages';
import { snippetTemplates } from '../data/defaultSnippets';
import {
  Transaction,
  Task,
  Snippet,
  Stakeholder,
  CommunicationLog,
  SavedPDF,
  SavedDocument,
  PhaseState,
  PhaseStatus,
  StageState,
  StageStatus,
  StageId,
  DeadlineItem,
  TaskCondition,
} from '../types';

interface TransactionContextType {
  // Transaction
  transaction: Transaction | null;
  createTransaction: () => void;
  updateTransaction: (updates: Partial<Transaction>) => void;
  resetTransaction: () => void;

  // Tasks
  tasks: Task[];
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  skipTask: (taskId: string) => void;
  unskipTask: (taskId: string) => void;
  getTaskById: (taskId: string) => Task | undefined;
  getIncompleteDependencies: (taskId: string) => Task[];
  hasPendingDependencies: (taskId: string) => boolean;

  // Phases
  phaseStates: PhaseState[];
  getPhaseState: (phaseId: string) => PhaseState | undefined;

  // Stages
  stageStates: StageState[];
  getStageState: (stageId: StageId) => StageState | undefined;
  getTasksForStage: (stageId: StageId) => Task[];
  getUpcomingDeadlines: () => DeadlineItem[];

  // Snippets
  snippets: Snippet[];
  addSnippet: (snippet: Omit<Snippet, 'id' | 'transactionId'>) => void;
  updateSnippet: (snippetId: string, updates: Partial<Snippet>) => void;
  deleteSnippet: (snippetId: string) => void;
  getSnippetsByCategory: (category: Snippet['category']) => Snippet[];

  // Stakeholders
  stakeholders: Stakeholder[];
  addStakeholder: (stakeholder: Omit<Stakeholder, 'id' | 'transactionId'>) => void;
  updateStakeholder: (stakeholderId: string, updates: Partial<Stakeholder>) => void;
  deleteStakeholder: (stakeholderId: string) => void;

  // Communication Logs
  communicationLogs: CommunicationLog[];
  addCommunicationLog: (log: Omit<CommunicationLog, 'id' | 'transactionId'>) => void;
  updateCommunicationLog: (logId: string, updates: Partial<CommunicationLog>) => void;
  deleteCommunicationLog: (logId: string) => void;

  // Saved PDFs
  savedPDFs: SavedPDF[];
  savePDF: (pdf: Omit<SavedPDF, 'id' | 'transactionId' | 'savedAt' | 'version'>) => void;
  deleteSavedPDF: (pdfId: string) => void;
  getSavedPDFsByDocument: (documentId: string) => SavedPDF[];

  // Saved Documents
  documents: SavedDocument[];
  addDocument: (doc: Omit<SavedDocument, 'id' | 'transactionId' | 'uploadedAt'>) => void;
  updateDocument: (docId: string, updates: Partial<SavedDocument>) => void;
  deleteDocument: (docId: string) => void;
}

export const TransactionContext = createContext<TransactionContextType | null>(null);

function evaluateCondition(condition: TaskCondition | null, transaction: Transaction): boolean {
  if (!condition) return true;
  switch (condition.type) {
    case 'has_hoa':
      return transaction.hasHOA;
    case 'has_loan':
      return transaction.hasLoan;
    case 'is_new_construction':
      return transaction.isNewConstruction;
    case 'custom':
      return true; // Custom conditions are always enabled by default
    default:
      return true;
  }
}

function createDefaultTransaction(): Transaction {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    propertyAddress: '',
    legalDescription: '',
    purchasePrice: 0,
    effectiveDate: null,
    closingDate: null,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    hasHOA: false,
    hasLoan: true,
    isNewConstruction: false,
  };
}

function createTasksFromPhases(transaction: Transaction): Task[] {
  const tasks: Task[] = [];

  for (const phase of phases) {
    for (const taskDef of phase.tasks) {
      const isEnabled = evaluateCondition(taskDef.condition, transaction);
      tasks.push({
        id: taskDef.id,
        phaseId: phase.id,
        title: taskDef.title,
        description: taskDef.description,
        instructions: taskDef.instructions,
        taskType: taskDef.taskType,
        completed: false,
        completedAt: null,
        skipped: false,
        skippedAt: null,
        notes: '',
        dependsOn: taskDef.dependsOn,
        dependedOnBy: [],
        externalDependency: taskDef.externalDependency,
        userTimeEstimate: taskDef.userTimeEstimate,
        externalWaitTime: taskDef.externalWaitTime,
        condition: taskDef.condition,
        isEnabled,
        relatedDocuments: taskDef.relatedDocuments,
        relatedStakeholderRole: taskDef.relatedStakeholderRole,
        deadlineType: taskDef.deadlineType,
        deadlineDays: taskDef.deadlineDays,
        deadlineDate: null,
      });
    }
  }

  // Calculate dependedOnBy (reverse of dependsOn)
  for (const task of tasks) {
    for (const depTaskId of task.dependsOn) {
      const depTask = tasks.find((t) => t.id === depTaskId);
      if (depTask && !depTask.dependedOnBy.includes(task.id)) {
        depTask.dependedOnBy.push(task.id);
      }
    }
  }

  return tasks;
}

function createDefaultSnippets(transactionId: string): Snippet[] {
  return snippetTemplates.map((template) => ({
    id: generateId(),
    transactionId,
    category: template.category,
    label: template.label,
    value: template.defaultValue,
    pdfFieldMapping: template.pdfFieldMapping,
  }));
}

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transaction, setTransaction] = useLocalStorage<Transaction | null>(
    'transaction',
    null
  );
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [snippets, setSnippets] = useLocalStorage<Snippet[]>('snippets', []);
  const [stakeholders, setStakeholders] = useLocalStorage<Stakeholder[]>('stakeholders', []);
  const [communicationLogs, setCommunicationLogs] = useLocalStorage<CommunicationLog[]>(
    'communicationLogs',
    []
  );
  const [savedPDFs, setSavedPDFs] = useLocalStorage<SavedPDF[]>('savedPDFs', []);
  const [documents, setDocuments] = useLocalStorage<SavedDocument[]>('documents', []);

  // Transaction methods
  const createTransaction = useCallback(() => {
    const newTransaction = createDefaultTransaction();
    setTransaction(newTransaction);
    setTasks(createTasksFromPhases(newTransaction));
    setSnippets(createDefaultSnippets(newTransaction.id));
    setStakeholders([]);
    setCommunicationLogs([]);
    setSavedPDFs([]);
    setDocuments([]);
  }, [setTransaction, setTasks, setSnippets, setStakeholders, setCommunicationLogs, setSavedPDFs, setDocuments]);

  const updateTransaction = useCallback(
    (updates: Partial<Transaction>) => {
      setTransaction((prev) => {
        if (!prev) return prev;
        const updated = {
          ...prev,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        // Re-evaluate task conditions if relevant flags changed
        if (
          'hasHOA' in updates ||
          'hasLoan' in updates ||
          'isNewConstruction' in updates
        ) {
          setTasks((prevTasks) =>
            prevTasks.map((task) => ({
              ...task,
              isEnabled: evaluateCondition(task.condition, updated),
            }))
          );
        }

        return updated;
      });
    },
    [setTransaction, setTasks]
  );

  const resetTransaction = useCallback(() => {
    setTransaction(null);
    setTasks([]);
    setSnippets([]);
    setStakeholders([]);
    setCommunicationLogs([]);
    setSavedPDFs([]);
    setDocuments([]);
  }, [setTransaction, setTasks, setSnippets, setStakeholders, setCommunicationLogs, setSavedPDFs, setDocuments]);

  // Task methods
  const updateTask = useCallback(
    (taskId: string, updates: Partial<Task>) => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id !== taskId) return task;
          const updated = { ...task, ...updates };
          if (updates.completed && !task.completed) {
            updated.completedAt = new Date().toISOString();
            // If completing, also clear skipped status
            updated.skipped = false;
            updated.skippedAt = null;
          } else if (updates.completed === false) {
            updated.completedAt = null;
          }
          return updated;
        })
      );
    },
    [setTasks]
  );

  const skipTask = useCallback(
    (taskId: string) => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id !== taskId) return task;
          return {
            ...task,
            skipped: true,
            skippedAt: new Date().toISOString(),
          };
        })
      );
    },
    [setTasks]
  );

  const unskipTask = useCallback(
    (taskId: string) => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.id !== taskId) return task;
          return {
            ...task,
            skipped: false,
            skippedAt: null,
          };
        })
      );
    },
    [setTasks]
  );

  const getTaskById = useCallback(
    (taskId: string): Task | undefined => {
      return tasks.find((t) => t.id === taskId);
    },
    [tasks]
  );

  // Get tasks that this task depends on that are not yet completed
  const getIncompleteDependencies = useCallback(
    (taskId: string): Task[] => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return [];
      // Handle old data that might have blockedBy instead of dependsOn
      const deps = task.dependsOn || (task as any).blockedBy || [];
      return deps
        .map((depId: string) => tasks.find((t) => t.id === depId))
        .filter((t: Task | undefined): t is Task => t !== undefined && t.isEnabled && !t.completed);
    },
    [tasks]
  );

  // Check if task has any incomplete dependencies (informational only, not blocking)
  const hasPendingDependencies = useCallback(
    (taskId: string): boolean => {
      return getIncompleteDependencies(taskId).length > 0;
    },
    [getIncompleteDependencies]
  );

  // Phase state calculations
  const phaseStates = useMemo((): PhaseState[] => {
    return phases.map((phase) => {
      const phaseTasks = tasks.filter((t) => t.phaseId === phase.id);
      const enabledTasks = phaseTasks.filter((t) => t.isEnabled);
      const completedTasks = enabledTasks.filter((t) => t.completed);
      const skippedTasks = enabledTasks.filter((t) => (t.skipped || false) && !t.completed);

      let status: PhaseStatus = 'pending';

      if (enabledTasks.length === 0) {
        status = 'complete';
      } else if (completedTasks.length === enabledTasks.length) {
        status = 'complete';
      } else if (completedTasks.length > 0 || skippedTasks.length > 0) {
        status = 'active';
      }

      return {
        phase,
        status,
        completedTasks: completedTasks.length,
        skippedTasks: skippedTasks.length,
        totalTasks: phaseTasks.length,
        enabledTasks: enabledTasks.length,
      };
    });
  }, [tasks]);

  const getPhaseState = useCallback(
    (phaseId: string): PhaseState | undefined => {
      return phaseStates.find((ps) => ps.phase.id === phaseId);
    },
    [phaseStates]
  );

  // Stage state calculations
  const stageStates = useMemo((): StageState[] => {
    return stages.map((stage) => {
      // Get all tasks for phases in this stage
      const stageTasks = tasks.filter((t) => {
        const phase = phases.find((p) => p.id === t.phaseId);
        return phase && stage.phaseIds.includes(phase.id);
      });
      const enabledTasks = stageTasks.filter((t) => t.isEnabled);
      const completedTasks = enabledTasks.filter((t) => t.completed);

      let status: StageStatus = 'pending';

      if (enabledTasks.length === 0) {
        status = 'complete';
      } else if (completedTasks.length === enabledTasks.length) {
        status = 'complete';
      } else if (completedTasks.length > 0) {
        status = 'active';
      }

      return {
        stage,
        status,
        completedTasks: completedTasks.length,
        totalTasks: stageTasks.length,
        enabledTasks: enabledTasks.length,
      };
    });
  }, [tasks]);

  const getStageState = useCallback(
    (stageId: StageId): StageState | undefined => {
      return stageStates.find((ss) => ss.stage.id === stageId);
    },
    [stageStates]
  );

  const getTasksForStage = useCallback(
    (stageId: StageId): Task[] => {
      const stage = stages.find((s) => s.id === stageId);
      if (!stage) return [];
      return tasks.filter((t) => {
        const phase = phases.find((p) => p.id === t.phaseId);
        return phase && stage.phaseIds.includes(phase.id);
      });
    },
    [tasks]
  );

  const getUpcomingDeadlines = useCallback((): DeadlineItem[] => {
    if (!transaction?.effectiveDate) return [];

    const effectiveDate = new Date(transaction.effectiveDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadlines: DeadlineItem[] = [];

    for (const task of tasks) {
      if (!task.isEnabled || task.completed) continue;
      if (task.deadlineType === 'none' || task.deadlineDays === null) continue;

      const deadlineDate = new Date(effectiveDate);
      deadlineDate.setDate(deadlineDate.getDate() + task.deadlineDays);
      deadlineDate.setHours(0, 0, 0, 0);

      const daysUntil = Math.ceil(
        (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Find the stage for this task
      const phase = phases.find((p) => p.id === task.phaseId);
      const stage = phase ? stages.find((s) => s.phaseIds.includes(phase.id)) : null;

      if (stage) {
        deadlines.push({
          taskId: task.id,
          taskTitle: task.title,
          stageId: stage.id,
          stageName: stage.shortName,
          deadlineDate,
          daysUntil,
          isUrgent: daysUntil <= 3,
          isUpcoming: daysUntil <= 7,
        });
      }
    }

    // Sort by deadline date
    return deadlines.sort((a, b) => a.deadlineDate.getTime() - b.deadlineDate.getTime());
  }, [tasks, transaction?.effectiveDate]);

  // Snippet methods
  const addSnippet = useCallback(
    (snippet: Omit<Snippet, 'id' | 'transactionId'>) => {
      if (!transaction) return;
      setSnippets((prev) => [
        ...prev,
        {
          ...snippet,
          id: generateId(),
          transactionId: transaction.id,
        },
      ]);
    },
    [transaction, setSnippets]
  );

  const updateSnippet = useCallback(
    (snippetId: string, updates: Partial<Snippet>) => {
      setSnippets((prev) =>
        prev.map((s) => (s.id === snippetId ? { ...s, ...updates } : s))
      );
    },
    [setSnippets]
  );

  const deleteSnippet = useCallback(
    (snippetId: string) => {
      setSnippets((prev) => prev.filter((s) => s.id !== snippetId));
    },
    [setSnippets]
  );

  const getSnippetsByCategory = useCallback(
    (category: Snippet['category']): Snippet[] => {
      return snippets.filter((s) => s.category === category);
    },
    [snippets]
  );

  // Stakeholder methods
  const addStakeholder = useCallback(
    (stakeholder: Omit<Stakeholder, 'id' | 'transactionId'>) => {
      if (!transaction) return;
      setStakeholders((prev) => [
        ...prev,
        {
          ...stakeholder,
          id: generateId(),
          transactionId: transaction.id,
        },
      ]);
    },
    [transaction, setStakeholders]
  );

  const updateStakeholder = useCallback(
    (stakeholderId: string, updates: Partial<Stakeholder>) => {
      setStakeholders((prev) =>
        prev.map((s) => (s.id === stakeholderId ? { ...s, ...updates } : s))
      );
    },
    [setStakeholders]
  );

  const deleteStakeholder = useCallback(
    (stakeholderId: string) => {
      setStakeholders((prev) => prev.filter((s) => s.id !== stakeholderId));
    },
    [setStakeholders]
  );

  // Communication Log methods
  const addCommunicationLog = useCallback(
    (log: Omit<CommunicationLog, 'id' | 'transactionId'>) => {
      if (!transaction) return;
      setCommunicationLogs((prev) => [
        ...prev,
        {
          ...log,
          id: generateId(),
          transactionId: transaction.id,
        },
      ]);
    },
    [transaction, setCommunicationLogs]
  );

  const updateCommunicationLog = useCallback(
    (logId: string, updates: Partial<CommunicationLog>) => {
      setCommunicationLogs((prev) =>
        prev.map((l) => (l.id === logId ? { ...l, ...updates } : l))
      );
    },
    [setCommunicationLogs]
  );

  const deleteCommunicationLog = useCallback(
    (logId: string) => {
      setCommunicationLogs((prev) => prev.filter((l) => l.id !== logId));
    },
    [setCommunicationLogs]
  );

  // Saved PDF methods
  const savePDF = useCallback(
    (pdf: Omit<SavedPDF, 'id' | 'transactionId' | 'savedAt' | 'version'>) => {
      if (!transaction) return;
      setSavedPDFs((prev) => {
        const existingVersions = prev.filter(
          (p) => p.documentId === pdf.documentId
        );
        const nextVersion = existingVersions.length + 1;
        return [
          ...prev,
          {
            ...pdf,
            id: generateId(),
            transactionId: transaction.id,
            savedAt: new Date().toISOString(),
            version: nextVersion,
          },
        ];
      });
    },
    [transaction, setSavedPDFs]
  );

  const deleteSavedPDF = useCallback(
    (pdfId: string) => {
      setSavedPDFs((prev) => prev.filter((p) => p.id !== pdfId));
    },
    [setSavedPDFs]
  );

  const getSavedPDFsByDocument = useCallback(
    (documentId: string): SavedPDF[] => {
      return savedPDFs
        .filter((p) => p.documentId === documentId)
        .sort((a, b) => b.version - a.version);
    },
    [savedPDFs]
  );

  // Document methods
  const addDocument = useCallback(
    (doc: Omit<SavedDocument, 'id' | 'transactionId' | 'uploadedAt'>) => {
      if (!transaction) return;
      setDocuments((prev) => [
        ...prev,
        {
          ...doc,
          id: generateId(),
          transactionId: transaction.id,
          uploadedAt: new Date().toISOString(),
        },
      ]);
    },
    [transaction, setDocuments]
  );

  const updateDocument = useCallback(
    (docId: string, updates: Partial<SavedDocument>) => {
      setDocuments((prev) =>
        prev.map((d) => (d.id === docId ? { ...d, ...updates } : d))
      );
    },
    [setDocuments]
  );

  const deleteDocument = useCallback(
    (docId: string) => {
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    },
    [setDocuments]
  );

  const value = useMemo(
    () => ({
      transaction,
      createTransaction,
      updateTransaction,
      resetTransaction,
      tasks,
      updateTask,
      skipTask,
      unskipTask,
      getTaskById,
      getIncompleteDependencies,
      hasPendingDependencies,
      phaseStates,
      getPhaseState,
      stageStates,
      getStageState,
      getTasksForStage,
      getUpcomingDeadlines,
      snippets,
      addSnippet,
      updateSnippet,
      deleteSnippet,
      getSnippetsByCategory,
      stakeholders,
      addStakeholder,
      updateStakeholder,
      deleteStakeholder,
      communicationLogs,
      addCommunicationLog,
      updateCommunicationLog,
      deleteCommunicationLog,
      savedPDFs,
      savePDF,
      deleteSavedPDF,
      getSavedPDFsByDocument,
      documents,
      addDocument,
      updateDocument,
      deleteDocument,
    }),
    [
      transaction,
      createTransaction,
      updateTransaction,
      resetTransaction,
      tasks,
      updateTask,
      skipTask,
      unskipTask,
      getTaskById,
      getIncompleteDependencies,
      hasPendingDependencies,
      phaseStates,
      getPhaseState,
      stageStates,
      getStageState,
      getTasksForStage,
      getUpcomingDeadlines,
      snippets,
      addSnippet,
      updateSnippet,
      deleteSnippet,
      getSnippetsByCategory,
      stakeholders,
      addStakeholder,
      updateStakeholder,
      deleteStakeholder,
      communicationLogs,
      addCommunicationLog,
      updateCommunicationLog,
      deleteCommunicationLog,
      savedPDFs,
      savePDF,
      deleteSavedPDF,
      getSavedPDFsByDocument,
      documents,
      addDocument,
      updateDocument,
      deleteDocument,
    ]
  );

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
