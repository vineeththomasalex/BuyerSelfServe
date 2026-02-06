import { StakeholderRole } from '../types';

export interface RoleInfo {
  role: StakeholderRole;
  label: string;
  description: string;
}

export const stakeholderRoles: RoleInfo[] = [
  {
    role: 'seller',
    label: 'Seller',
    description: 'The property owner selling the home',
  },
  {
    role: 'seller_agent',
    label: 'Listing Agent',
    description: "The seller's real estate agent",
  },
  {
    role: 'title_company',
    label: 'Title Company',
    description: 'Handles escrow, title search, and closing',
  },
  {
    role: 'lender',
    label: 'Lender',
    description: 'Mortgage company or loan officer',
  },
  {
    role: 'inspector',
    label: 'Home Inspector',
    description: 'Licensed home inspector',
  },
  {
    role: 'appraiser',
    label: 'Appraiser',
    description: 'Property appraiser (ordered by lender)',
  },
  {
    role: 'insurance_agent',
    label: 'Insurance Agent',
    description: 'Homeowners insurance provider',
  },
  {
    role: 'hoa',
    label: 'HOA',
    description: 'Homeowners Association',
  },
  {
    role: 'other',
    label: 'Other',
    description: 'Other party involved in transaction',
  },
];

export function getRoleLabel(role: StakeholderRole): string {
  const info = stakeholderRoles.find((r) => r.role === role);
  return info?.label ?? role;
}
