import React from 'react';
import { SavedDocument, DocumentCategory } from '../../types';
import { Button, Card, CardBody } from '../common';
import { formatDate } from '../../utils/dates';

interface DocumentItemProps {
  document: SavedDocument;
  onDownload: (doc: SavedDocument) => void;
  onDelete: (docId: string) => void;
}

const categoryLabels: Record<DocumentCategory, string> = {
  'pre-approval': 'Pre-Approval',
  'inspection': 'Inspection',
  'appraisal': 'Appraisal',
  'title': 'Title',
  'insurance': 'Insurance',
  'contract': 'Contract',
  'other': 'Other',
};

const categoryColors: Record<DocumentCategory, string> = {
  'pre-approval': 'bg-green-100 text-green-700',
  'inspection': 'bg-blue-100 text-blue-700',
  'appraisal': 'bg-purple-100 text-purple-700',
  'title': 'bg-orange-100 text-orange-700',
  'insurance': 'bg-yellow-100 text-yellow-700',
  'contract': 'bg-red-100 text-red-700',
  'other': 'bg-gray-100 text-gray-700',
};

export function DocumentItem({ document, onDownload, onDelete }: DocumentItemProps) {
  const handleDelete = () => {
    if (confirm(`Delete "${document.name}"?`)) {
      onDelete(document.id);
    }
  };

  return (
    <Card>
      <CardBody className="!py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {/* File icon */}
            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              {document.mimeType.startsWith('image/') ? (
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
            </div>

            {/* Document info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {document.name}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded ${categoryColors[document.category]}`}>
                  {categoryLabels[document.category]}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {document.fileName} &bull; Uploaded {formatDate(document.uploadedAt)}
              </p>
              {document.notes && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {document.notes}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDownload(document)}
              className="!px-2"
              title="Download"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="!px-2 text-red-600 hover:text-red-700"
              title="Delete"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
