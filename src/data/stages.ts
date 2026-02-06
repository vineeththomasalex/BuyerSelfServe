import { Stage } from '../types';

export const stages: Stage[] = [
  {
    id: 'offer-prep',
    name: 'Offer Preparation',
    shortName: 'Offer Prep',
    description: 'Get ready and submit your offer',
    phaseIds: ['pre-offer', 'offer-submit', 'execution'],
    order: 1,
  },
  {
    id: 'option-period',
    name: 'Option Period',
    shortName: 'Option Period',
    description: 'Inspect the property and negotiate',
    phaseIds: ['option-period'],
    order: 2,
  },
  {
    id: 'loan-title',
    name: 'Loan & Title',
    shortName: 'Loan & Title',
    description: 'Financing approval and title work',
    phaseIds: ['loan-process', 'title-process'],
    order: 3,
  },
  {
    id: 'closing',
    name: 'Closing',
    shortName: 'Closing',
    description: 'Final steps and getting the keys',
    phaseIds: ['pre-closing', 'closing', 'post-closing'],
    order: 4,
  },
];

// Helper to get stage by ID
export function getStageById(stageId: string): Stage | undefined {
  return stages.find((s) => s.id === stageId);
}

// Helper to get stage for a phase
export function getStageForPhase(phaseId: string): Stage | undefined {
  return stages.find((s) => s.phaseIds.includes(phaseId));
}
