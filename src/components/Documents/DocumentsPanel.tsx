import React, { useState, useMemo } from 'react';
import { useTransaction } from '../../hooks/useTransaction';
import { SavedDocument, DocumentCategory } from '../../types';
import { SlidePanel, Button } from '../common';
import { DocumentItem } from './DocumentItem';
import { AddDocumentModal } from './AddDocumentModal';

interface DocumentsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryOrder: DocumentCategory[] = [
  'pre-approval',
  'contract',
  'inspection',
  'appraisal',
  'title',
  'insurance',
  'other',
];

const categoryLabels: Record<DocumentCategory, string> = {
  'pre-approval': 'Pre-Approval',
  'inspection': 'Inspection',
  'appraisal': 'Appraisal',
  'title': 'Title',
  'insurance': 'Insurance',
  'contract': 'Contract',
  'other': 'Other',
};

export function DocumentsPanel({ isOpen, onClose }: DocumentsPanelProps) {
  const { documents, addDocument, deleteDocument } = useTransaction();
  const [showAddModal, setShowAddModal] = useState(false);

  // Group documents by category
  const groupedDocuments = useMemo(() => {
    const groups: Record<DocumentCategory, SavedDocument[]> = {
      'pre-approval': [],
      'inspection': [],
      'appraisal': [],
      'title': [],
      'insurance': [],
      'contract': [],
      'other': [],
    };

    for (const doc of documents) {
      groups[doc.category].push(doc);
    }

    // Sort within each group by upload date (newest first)
    for (const category of categoryOrder) {
      groups[category].sort(
        (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
    }

    return groups;
  }, [documents]);

  const handleDownload = (doc: SavedDocument) => {
    // Create a blob from base64
    const byteCharacters = atob(doc.fileBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: doc.mimeType });

    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAdd = (doc: Omit<SavedDocument, 'id' | 'transactionId' | 'uploadedAt'>) => {
    addDocument(doc);
  };

  // Count total documents
  const totalDocuments = documents.length;

  return (
    <>
      <SlidePanel isOpen={isOpen} onClose={onClose} title="Documents" width="w-[420px]">
        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload and store important transaction documents
            </p>
            <Button variant="secondary" size="sm" onClick={() => setShowAddModal(true)}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload
            </Button>
          </div>

          {/* Storage warning */}
          {totalDocuments > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <p className="text-xs text-yellow-800 dark:text-yellow-300">
                Documents are stored in your browser. Keep files under 2 MB each for best results.
                Consider keeping copies elsewhere as backup.
              </p>
            </div>
          )}

          {/* Empty state */}
          {totalDocuments === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <svg
                className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              <p>No documents uploaded yet</p>
              <p className="text-sm mt-1">
                Upload pre-approval letters, inspection reports, and other important documents.
              </p>
              <Button variant="primary" size="sm" className="mt-4" onClick={() => setShowAddModal(true)}>
                Upload First Document
              </Button>
            </div>
          )}

          {/* Document lists by category */}
          {totalDocuments > 0 && (
            <div className="space-y-6">
              {categoryOrder.map((category) => {
                const categoryDocs = groupedDocuments[category];
                if (categoryDocs.length === 0) return null;

                return (
                  <div key={category}>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      {categoryLabels[category]}
                    </h3>
                    <div className="space-y-2">
                      {categoryDocs.map((doc) => (
                        <DocumentItem
                          key={doc.id}
                          document={doc}
                          onDownload={handleDownload}
                          onDelete={deleteDocument}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SlidePanel>

      <AddDocumentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAdd}
      />
    </>
  );
}
