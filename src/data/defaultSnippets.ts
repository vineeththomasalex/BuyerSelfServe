import { Snippet } from '../types';

export interface SnippetTemplate {
  category: Snippet['category'];
  label: string;
  defaultValue: string;
  pdfFieldMapping: string[];
}

export const snippetTemplates: SnippetTemplate[] = [
  // Property Info
  {
    category: 'property',
    label: 'Property Address',
    defaultValue: '',
    pdfFieldMapping: ['PropertyAddress'],
  },
  {
    category: 'property',
    label: 'City, State, ZIP',
    defaultValue: '',
    pdfFieldMapping: ['PropertyCityStateZip'],
  },
  {
    category: 'property',
    label: 'Legal Description',
    defaultValue: '',
    pdfFieldMapping: ['LegalDescription'],
  },
  {
    category: 'property',
    label: 'County',
    defaultValue: '',
    pdfFieldMapping: ['County'],
  },

  // Buyer Info
  {
    category: 'buyer',
    label: 'Full Name',
    defaultValue: '',
    pdfFieldMapping: ['BuyerName', 'Buyer1Name'],
  },
  {
    category: 'buyer',
    label: 'Mailing Address',
    defaultValue: '',
    pdfFieldMapping: ['BuyerAddress', 'BuyerMailingAddress'],
  },
  {
    category: 'buyer',
    label: 'Phone',
    defaultValue: '',
    pdfFieldMapping: ['BuyerPhone'],
  },
  {
    category: 'buyer',
    label: 'Email',
    defaultValue: '',
    pdfFieldMapping: ['BuyerEmail'],
  },

  // Seller Info
  {
    category: 'seller',
    label: 'Full Name',
    defaultValue: '',
    pdfFieldMapping: ['SellerName', 'Seller1Name'],
  },
  {
    category: 'seller',
    label: 'Mailing Address',
    defaultValue: '',
    pdfFieldMapping: ['SellerAddress'],
  },

  // Transaction Info
  {
    category: 'transaction',
    label: 'Purchase Price',
    defaultValue: '',
    pdfFieldMapping: ['SalesPrice', 'PurchasePrice'],
  },
  {
    category: 'transaction',
    label: 'Earnest Money',
    defaultValue: '',
    pdfFieldMapping: ['EarnestMoney'],
  },
  {
    category: 'transaction',
    label: 'Option Fee',
    defaultValue: '',
    pdfFieldMapping: ['OptionFee'],
  },
  {
    category: 'transaction',
    label: 'Option Period Days',
    defaultValue: '10',
    pdfFieldMapping: ['OptionPeriodDays'],
  },
  {
    category: 'transaction',
    label: 'Loan Amount',
    defaultValue: '',
    pdfFieldMapping: ['LoanAmount'],
  },
  {
    category: 'transaction',
    label: 'Down Payment',
    defaultValue: '',
    pdfFieldMapping: ['DownPayment'],
  },
];

export function getCategoryLabel(category: Snippet['category']): string {
  switch (category) {
    case 'property':
      return 'Property Info';
    case 'buyer':
      return 'Buyer Info';
    case 'seller':
      return 'Seller Info';
    case 'transaction':
      return 'Transaction Info';
    case 'custom':
      return 'Custom Snippets';
    default:
      return category;
  }
}
