// Stage grouping for chronological navigation
export type StageId = 'offer-prep' | 'option-period' | 'loan-title' | 'closing';

export interface Stage {
  id: StageId;
  name: string;
  shortName: string;
  description: string;
  phaseIds: string[];
  order: number;
}

// Task type tags for categorization
export type TaskType = 'action' | 'paperwork' | 'payment' | 'waiting';

// Core transaction
export interface Transaction {
  id: string;
  propertyAddress: string;
  legalDescription: string;
  purchasePrice: number;
  effectiveDate: string | null;
  closingDate: string | null;
  status: 'draft' | 'active' | 'closed' | 'terminated';
  createdAt: string;
  updatedAt: string;
  // Conditional flags
  hasHOA: boolean;
  hasLoan: boolean; // vs cash purchase
  isNewConstruction: boolean;
}

// Task condition types
export type TaskCondition =
  | { type: 'has_hoa' }
  | { type: 'has_loan' }
  | { type: 'is_new_construction' }
  | { type: 'custom'; label: string };

// Task with dependencies and timing
export interface Task {
  id: string;
  phaseId: string;
  title: string;
  description: string;
  instructions: string[];

  // Task type for visual categorization
  taskType: TaskType;

  // Status
  completed: boolean;
  completedAt: string | null;
  skipped: boolean;
  skippedAt: string | null;
  notes: string;

  // Dependencies (informational, not blocking)
  dependsOn: string[]; // Task IDs this task depends on
  dependedOnBy: string[]; // Task IDs that depend on this task
  externalDependency: string | null; // Description of external dependency

  // Timing
  userTimeEstimate: string; // e.g., "30 min", "1-2 hours"
  externalWaitTime: string; // e.g., "1-3 days", "same day"

  // Conditional
  condition: TaskCondition | null;
  isEnabled: boolean; // Based on condition evaluation

  // Related
  relatedDocuments: string[]; // Document IDs
  relatedStakeholderRole: StakeholderRole | null;

  // Deadline
  deadlineType: 'fixed_date' | 'days_from_effective' | 'none';
  deadlineDays: number | null;
  deadlineDate: string | null;
}

// Task definition (static data)
export interface TaskDefinition {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  taskType: TaskType; // Task type for visual categorization
  dependsOn: string[]; // Task IDs this task depends on
  externalDependency: string | null; // Description of external dependency
  userTimeEstimate: string;
  externalWaitTime: string;
  condition: TaskCondition | null;
  relatedDocuments: string[];
  relatedStakeholderRole: StakeholderRole | null;
  deadlineType: 'fixed_date' | 'days_from_effective' | 'none';
  deadlineDays: number | null;
}

// Snippets for quick-paste
export interface Snippet {
  id: string;
  transactionId: string;
  category: 'property' | 'buyer' | 'seller' | 'transaction' | 'custom';
  label: string;
  value: string;
  pdfFieldMapping: string[]; // Which PDF fields this maps to
}

// Saved PDF with filled data
export interface SavedPDF {
  id: string;
  transactionId: string;
  documentId: string;
  name: string;
  filledData: Record<string, string>; // field name -> value
  pdfBase64: string; // The filled PDF as base64
  savedAt: string;
  version: number;
}

// Phase definition (static data)
export interface PhaseDefinition {
  id: string;
  number: number;
  name: string;
  shortName: string;
  description: string;
  stageId: StageId; // Which stage this phase belongs to
  typicalDaysStart: number; // Days from effective date
  typicalDaysEnd: number;
  tasks: TaskDefinition[];
}

// PDF field mapping for auto-fill
export interface PDFFieldMapping {
  pdfFieldName: string; // Actual field name in PDF
  snippetCategory: string;
  snippetLabel: string;
  description: string;
}

// Document definition (static data)
export interface DocumentDefinition {
  id: string;
  name: string;
  trecFormNumber: string | null;
  officialUrl: string;
  localPdfPath: string; // Path to bundled PDF in /public/pdfs/
  description: string;
  phaseId: string;
  isRequired: boolean;
  condition: TaskCondition | null;
  formFields: PDFFieldMapping[];
}

// Stakeholder roles
export type StakeholderRole =
  | 'seller'
  | 'seller_agent'
  | 'title_company'
  | 'lender'
  | 'inspector'
  | 'appraiser'
  | 'insurance_agent'
  | 'hoa'
  | 'other';

// Stakeholder (user-entered)
export interface Stakeholder {
  id: string;
  transactionId: string;
  role: StakeholderRole;
  name: string;
  company: string;
  phone: string;
  email: string;
  notes: string;
}

// Communication log
export interface CommunicationLog {
  id: string;
  transactionId: string;
  stakeholderId: string;
  taskId: string | null; // Optional link to related task
  date: string;
  type: 'call' | 'email' | 'text' | 'in_person' | 'other';
  summary: string;
  followUpNeeded: boolean;
  followUpDate: string | null;
}

// Phase status for UI
export type PhaseStatus = 'complete' | 'active' | 'pending';

// Computed phase state for UI
export interface PhaseState {
  phase: PhaseDefinition;
  status: PhaseStatus;
  completedTasks: number;
  skippedTasks: number;
  totalTasks: number;
  enabledTasks: number;
}

// Stage status for UI
export type StageStatus = 'complete' | 'active' | 'pending';

// Computed stage state for UI
export interface StageState {
  stage: Stage;
  status: StageStatus;
  completedTasks: number;
  totalTasks: number;
  enabledTasks: number;
}

// Deadline item for sidebar
export interface DeadlineItem {
  taskId: string;
  taskTitle: string;
  stageId: StageId;
  stageName: string;
  deadlineDate: Date;
  daysUntil: number;
  isUrgent: boolean; // 3 days or less
  isUpcoming: boolean; // 7 days or less
  amount?: number; // For payment deadlines
}

// Document categories for saved documents
export type DocumentCategory =
  | 'pre-approval'
  | 'inspection'
  | 'appraisal'
  | 'title'
  | 'insurance'
  | 'contract'
  | 'other';

// Saved document (uploaded by user)
export interface SavedDocument {
  id: string;
  transactionId: string;
  name: string;           // User-provided name
  fileName: string;       // Original file name
  mimeType: string;       // e.g., 'application/pdf', 'image/jpeg'
  fileBase64: string;     // Base64-encoded file content
  category: DocumentCategory;
  uploadedAt: string;
  notes: string;
  taskId?: string;        // Optional link to related task
}
