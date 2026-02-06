import React from 'react';
import { SavedPDF } from '../../types';
import { useTransaction } from '../../hooks/useTransaction';
import { Button, Card } from '../common';
import { formatDate } from '../../utils/dates';

interface SavedPDFListProps {
  savedPDFs: SavedPDF[];
  onLoad: (pdfBase64: string, filledData: Record<string, string>) => void;
  onClose: () => void;
}

export function SavedPDFList({ savedPDFs, onLoad, onClose }: SavedPDFListProps) {
  const { deleteSavedPDF } = useTransaction();

  const handleDownload = (pdf: SavedPDF) => {
    const binary = atob(pdf.pdfBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${pdf.name}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDelete = (pdfId: string) => {
    if (confirm('Delete this saved draft?')) {
      deleteSavedPDF(pdfId);
    }
  };

  return (
    <Card className="bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">Saved Drafts</h4>
          <button onClick={onClose} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="space-y-2">
          {savedPDFs.map((pdf) => (
            <div
              key={pdf.id}
              className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{pdf.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  v{pdf.version} - {formatDate(pdf.savedAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLoad(pdf.pdfBase64, pdf.filledData)}
                >
                  Load
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDownload(pdf)}>
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(pdf.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
