import React from 'react';
import { StageId, StageState } from '../../types';
import { StageNavItem, ResourceNavItem } from '../Navigation';

interface LeftNavProps {
  stageStates: StageState[];
  currentStage: StageId;
  onStageSelect: (stageId: StageId) => void;
  onOpenSnippets: () => void;
  onOpenDocuments: () => void;
  onOpenContacts: () => void;
  onOpenCommLog: () => void;
  onOpenSettings: () => void;
}

export function LeftNav({
  stageStates,
  currentStage,
  onStageSelect,
  onOpenSnippets,
  onOpenDocuments,
  onOpenContacts,
  onOpenCommLog,
  onOpenSettings,
}: LeftNavProps) {
  return (
    <nav className="w-56 flex-shrink-0 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Stages */}
      <div className="flex-1 overflow-y-auto p-3">
        <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Stages
        </h3>
        <div className="space-y-1">
          {stageStates.map((stageState) => (
            <StageNavItem
              key={stageState.stage.id}
              stageState={stageState}
              isActive={currentStage === stageState.stage.id}
              onClick={() => onStageSelect(stageState.stage.id)}
            />
          ))}
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-gray-200 dark:border-gray-700" />

        {/* Resources */}
        <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Resources
        </h3>
        <div className="space-y-1">
          <ResourceNavItem
            label="Snippets"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            onClick={onOpenSnippets}
          />
          <ResourceNavItem
            label="Documents"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            }
            onClick={onOpenDocuments}
          />
          <ResourceNavItem
            label="Contacts"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            onClick={onOpenContacts}
          />
          <ResourceNavItem
            label="Communication Log"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            }
            onClick={onOpenCommLog}
          />
        </div>
      </div>

      {/* Settings at bottom */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <ResourceNavItem
          label="Settings"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          onClick={onOpenSettings}
        />
      </div>
    </nav>
  );
}
