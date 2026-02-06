import React, { useState } from 'react';
import { useTransaction } from '../../hooks/useTransaction';
import { Modal, Button, Input } from '../common';

interface AddSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddSnippetModal({ isOpen, onClose }: AddSnippetModalProps) {
  const { addSnippet } = useTransaction();
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    addSnippet({
      category: 'custom',
      label: label.trim(),
      value: value.trim(),
      pdfFieldMapping: [],
    });

    setLabel('');
    setValue('');
    onClose();
  };

  const handleClose = () => {
    setLabel('');
    setValue('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Custom Snippet" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g., Earnest Money Amount"
          required
        />
        <Input
          label="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g., $4,500.00"
        />
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!label.trim()}>
            Add Snippet
          </Button>
        </div>
      </form>
    </Modal>
  );
}
