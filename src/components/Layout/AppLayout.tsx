import React from 'react';
import { StageId, StageState, DeadlineItem } from '../../types';
import { Header } from './Header';
import { LeftNav } from './LeftNav';
import { DeadlineSidebar } from './DeadlineSidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  propertyAddress: string;
  stageStates: StageState[];
  currentStage: StageId;
  deadlines: DeadlineItem[];
  closingDate: string | null;
  onStageSelect: (stageId: StageId) => void;
  onOpenSnippets: () => void;
  onOpenDocuments: () => void;
  onOpenContacts: () => void;
  onOpenCommLog: () => void;
  onOpenSettings: () => void;
  onDeadlineClick?: (taskId: string, stageId: StageId) => void;
}

export function AppLayout({
  children,
  propertyAddress,
  stageStates,
  currentStage,
  deadlines,
  closingDate,
  onStageSelect,
  onOpenSnippets,
  onOpenDocuments,
  onOpenContacts,
  onOpenCommLog,
  onOpenSettings,
  onDeadlineClick,
}: AppLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header
        propertyAddress={propertyAddress}
        onOpenSnippets={onOpenSnippets}
        onOpenSettings={onOpenSettings}
      />

      <div className="flex-1 flex overflow-hidden">
        <LeftNav
          stageStates={stageStates}
          currentStage={currentStage}
          onStageSelect={onStageSelect}
          onOpenSnippets={onOpenSnippets}
          onOpenDocuments={onOpenDocuments}
          onOpenContacts={onOpenContacts}
          onOpenCommLog={onOpenCommLog}
          onOpenSettings={onOpenSettings}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>

        <DeadlineSidebar
          deadlines={deadlines}
          closingDate={closingDate}
          onDeadlineClick={onDeadlineClick}
        />
      </div>
    </div>
  );
}
