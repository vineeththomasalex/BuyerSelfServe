import React, { useState, useRef } from 'react';
import { DocumentCategory } from '../../types';
import { Modal, Button, Input, Select, TextArea } from '../common';

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (doc: {
    name: string;
    fileName: string;
    mimeType: string;
    fileBase64: string;
    category: DocumentCategory;
    notes: string;
  }) => void;
}

const categoryOptions: { value: DocumentCategory; label: string }[] = [
  { value: 'pre-approval', label: 'Pre-Approval Letter' },
  { value: 'inspection', label: 'Inspection Report' },
  { value: 'appraisal', label: 'Appraisal' },
  { value: 'title', label: 'Title Documents' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'contract', label: 'Contract/Addendum' },
  { value: 'other', label: 'Other' },
];

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

export function AddDocumentModal({ isOpen, onClose, onAdd }: AddDocumentModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('other');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError('');

    // Check file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`File is too large. Maximum size is 2 MB. Your file is ${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB.`);
      setFile(null);
      setFileBase64('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setFile(selectedFile);

    // Auto-fill name if empty
    if (!name) {
      const baseName = selectedFile.name.replace(/\.[^/.]+$/, '');
      setName(baseName);
    }

    // Convert to base64
    setIsLoading(true);
    try {
      const base64 = await fileToBase64(selectedFile);
      setFileBase64(base64);
    } catch {
      setError('Failed to read file. Please try again.');
      setFile(null);
      setFileBase64('');
    } finally {
      setIsLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  };

  const handleSubmit = () => {
    if (!file || !fileBase64 || !name.trim()) return;

    onAdd({
      name: name.trim(),
      fileName: file.name,
      mimeType: file.type || 'application/octet-stream',
      fileBase64,
      category,
      notes: notes.trim(),
    });

    // Reset form
    setName('');
    setCategory('other');
    setNotes('');
    setFile(null);
    setFileBase64('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const handleClose = () => {
    setName('');
    setCategory('other');
    setNotes('');
    setFile(null);
    setFileBase64('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const isValid = file && fileBase64 && name.trim() && !isLoading;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload Document">
      <div className="space-y-4">
        {/* File input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            File
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 dark:text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-medium
              file:bg-blue-50 dark:file:bg-blue-900/50 file:text-blue-700 dark:file:text-blue-300
              hover:file:bg-blue-100 dark:hover:file:bg-blue-900/70
              cursor-pointer"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Max file size: 2 MB. Supported: PDF, Word docs, images
          </p>
          {error && (
            <p className="text-sm text-red-600 mt-1">{error}</p>
          )}
          {file && !error && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>

        {/* Document name */}
        <Input
          label="Document Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Pre-approval Letter from ABC Lending"
        />

        {/* Category */}
        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value as DocumentCategory)}
          options={categoryOptions}
        />

        {/* Notes */}
        <TextArea
          label="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional notes about this document..."
          rows={2}
        />

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            {isLoading ? 'Processing...' : 'Upload'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
