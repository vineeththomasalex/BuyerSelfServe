import { DocumentDefinition } from '../types';

export const documents: DocumentDefinition[] = [
  {
    id: 'trec-contract',
    name: 'One to Four Family Residential Contract (Resale)',
    trecFormNumber: 'TREC 20-17',
    officialUrl: 'https://www.trec.texas.gov/forms/one-four-family-residential-contract-resale',
    localPdfPath: '/pdfs/trec-20-17.pdf',
    description: 'The main contract form for purchasing a resale home in Texas',
    phaseId: 'offer-submit',
    isRequired: true,
    condition: null,
    formFields: [
      {
        pdfFieldName: 'PropertyAddress',
        snippetCategory: 'property',
        snippetLabel: 'Property Address',
        description: 'Full street address of property',
      },
      {
        pdfFieldName: 'LegalDescription',
        snippetCategory: 'property',
        snippetLabel: 'Legal Description',
        description: 'Legal description from deed or tax records',
      },
      {
        pdfFieldName: 'BuyerName',
        snippetCategory: 'buyer',
        snippetLabel: 'Full Name',
        description: 'Buyer full legal name',
      },
      {
        pdfFieldName: 'BuyerAddress',
        snippetCategory: 'buyer',
        snippetLabel: 'Mailing Address',
        description: 'Buyer current mailing address',
      },
      {
        pdfFieldName: 'SalesPrice',
        snippetCategory: 'transaction',
        snippetLabel: 'Purchase Price',
        description: 'Total purchase price',
      },
    ],
  },
  {
    id: 'financing-addendum',
    name: 'Third Party Financing Addendum',
    trecFormNumber: 'TREC 40-9',
    officialUrl: 'https://www.trec.texas.gov/forms/third-party-financing-addendum',
    localPdfPath: '/pdfs/trec-40-9.pdf',
    description: 'Required addendum when using a mortgage loan to purchase',
    phaseId: 'offer-submit',
    isRequired: false,
    condition: { type: 'has_loan' },
    formFields: [
      {
        pdfFieldName: 'LoanAmount',
        snippetCategory: 'transaction',
        snippetLabel: 'Loan Amount',
        description: 'Mortgage loan amount',
      },
    ],
  },
  {
    id: 'hoa-addendum',
    name: 'Addendum for Property Subject to Mandatory Membership in HOA',
    trecFormNumber: 'TREC 36-9',
    officialUrl: 'https://www.trec.texas.gov/forms/addendum-property-subject-mandatory-membership-owners-association',
    localPdfPath: '/pdfs/trec-36-9.pdf',
    description: 'Required addendum when property is in an HOA',
    phaseId: 'offer-submit',
    isRequired: false,
    condition: { type: 'has_hoa' },
    formFields: [],
  },
  {
    id: 'amendment',
    name: 'Amendment to Contract',
    trecFormNumber: 'TREC 39-10',
    officialUrl: 'https://www.trec.texas.gov/forms/amendment',
    localPdfPath: '/pdfs/trec-39-10.pdf',
    description: 'Used to make changes to the contract after execution (repairs, extensions, etc.)',
    phaseId: 'option-period',
    isRequired: false,
    condition: null,
    formFields: [
      {
        pdfFieldName: 'PropertyAddress',
        snippetCategory: 'property',
        snippetLabel: 'Property Address',
        description: 'Property address from original contract',
      },
    ],
  },
  {
    id: 'termination-notice',
    name: 'Notice of Buyer Termination of Contract',
    trecFormNumber: 'TREC 38-6',
    officialUrl: 'https://www.trec.texas.gov/forms/notice-buyers-termination-contract',
    localPdfPath: '/pdfs/trec-38-6.pdf',
    description: 'Form to terminate contract during option period',
    phaseId: 'option-period',
    isRequired: false,
    condition: null,
    formFields: [],
  },
  {
    id: 'sellers-disclosure',
    name: "Seller's Disclosure Notice",
    trecFormNumber: 'TREC OP-H',
    officialUrl: 'https://www.trec.texas.gov/forms/sellers-disclosure-notice',
    localPdfPath: '/pdfs/trec-op-h.pdf',
    description: "Seller's disclosure of known property conditions",
    phaseId: 'pre-offer',
    isRequired: true,
    condition: null,
    formFields: [],
  },
];

export function getDocumentById(id: string): DocumentDefinition | undefined {
  return documents.find((d) => d.id === id);
}

export function getDocumentsByPhase(phaseId: string): DocumentDefinition[] {
  return documents.filter((d) => d.phaseId === phaseId);
}
