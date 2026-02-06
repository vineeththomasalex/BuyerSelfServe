import React, { useState, useMemo } from 'react';
import { TransactionProvider } from './context/TransactionContext';
import { useTransaction } from './hooks/useTransaction';
import { StageId } from './types';
import { AppLayout } from './components/Layout';
import { StageView } from './components/Stage';
import { SnippetsPanel } from './components/Snippets';
import { DocumentsPanel } from './components/Documents';
import { PDFFillerModal } from './components/PDF';
import { StakeholderList, CommunicationLog } from './components/Stakeholders';
import { SettingsModal } from './components/SettingsModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { TaskDetailModal } from './components/PhaseDetail/TaskDetailModal';

function AppContent() {
  const { transaction, stageStates, getUpcomingDeadlines } = useTransaction();

  // UI State
  const [currentStage, setCurrentStage] = useState<StageId>('offer-prep');
  const [showSnippets, setShowSnippets] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [showCommLog, setShowCommLog] = useState(false);
  const [pdfDocumentId, setPdfDocumentId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Get deadlines
  const deadlines = useMemo(() => getUpcomingDeadlines(), [getUpcomingDeadlines]);

  // Determine the first incomplete stage to show by default
  useMemo(() => {
    const firstIncomplete = stageStates.find((ss) => ss.status !== 'complete');
    if (firstIncomplete && firstIncomplete.stage.id !== currentStage) {
      // Only auto-select on first load, not on every change
      // This is handled by initial state
    }
  }, [stageStates]);

  if (!transaction) {
    return <WelcomeScreen />;
  }

  const handleStageSelect = (stageId: StageId) => {
    setCurrentStage(stageId);
  };

  const handleDeadlineClick = (taskId: string, stageId: StageId) => {
    setCurrentStage(stageId);
    setSelectedTaskId(taskId);
  };

  const handleViewTaskDetails = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  const handleOpenPdf = (docId: string) => {
    setPdfDocumentId(docId);
  };

  return (
    <>
      <AppLayout
        propertyAddress={transaction.propertyAddress}
        stageStates={stageStates}
        currentStage={currentStage}
        deadlines={deadlines}
        closingDate={transaction.closingDate}
        onStageSelect={handleStageSelect}
        onOpenSnippets={() => setShowSnippets(true)}
        onOpenDocuments={() => setShowDocuments(true)}
        onOpenContacts={() => setShowContacts(true)}
        onOpenCommLog={() => setShowCommLog(true)}
        onOpenSettings={() => setShowSettings(true)}
        onDeadlineClick={handleDeadlineClick}
      >
        <StageView
          stageId={currentStage}
          onViewTaskDetails={handleViewTaskDetails}
          onOpenPdf={handleOpenPdf}
        />
      </AppLayout>

      {/* Modals */}
      <SnippetsPanel isOpen={showSnippets} onClose={() => setShowSnippets(false)} />
      <DocumentsPanel isOpen={showDocuments} onClose={() => setShowDocuments(false)} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <StakeholderList isOpen={showContacts} onClose={() => setShowContacts(false)} />
      <CommunicationLog isOpen={showCommLog} onClose={() => setShowCommLog(false)} />
      <PDFFillerModal documentId={pdfDocumentId} onClose={() => setPdfDocumentId(null)} />
      <TaskDetailModal
        taskId={selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
        onOpenPdfFiller={(docId) => {
          setSelectedTaskId(null);
          setPdfDocumentId(docId);
        }}
      />
    </>
  );
}

function App() {
  return (
    <TransactionProvider>
      <AppContent />
    </TransactionProvider>
  );
}

export default App;
