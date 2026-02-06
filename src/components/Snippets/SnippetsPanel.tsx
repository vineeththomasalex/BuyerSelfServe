import React, { useState } from 'react';
import { useTransaction } from '../../hooks/useTransaction';
import { getCategoryLabel } from '../../data/defaultSnippets';
import { SlidePanel, Button } from '../common';
import { SnippetItem } from './SnippetItem';
import { AddSnippetModal } from './AddSnippetModal';
import { Snippet } from '../../types';

interface SnippetsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SnippetsPanel({ isOpen, onClose }: SnippetsPanelProps) {
  const { snippets } = useTransaction();
  const [showAddModal, setShowAddModal] = useState(false);

  // Group snippets by category
  const categories: Snippet['category'][] = ['property', 'buyer', 'seller', 'transaction', 'custom'];
  const groupedSnippets = categories.reduce((acc, category) => {
    acc[category] = snippets.filter((s) => s.category === category);
    return acc;
  }, {} as Record<Snippet['category'], Snippet[]>);

  return (
    <>
      <SlidePanel isOpen={isOpen} onClose={onClose} title="Snippets" side="left" width="w-96">
        <div className="p-4 space-y-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Click any value to copy. Values auto-fill PDFs.
          </p>

          {categories.map((category) => {
            const categorySnippets = groupedSnippets[category];
            if (categorySnippets.length === 0 && category !== 'custom') return null;

            return (
              <div key={category}>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                  {getCategoryLabel(category)}
                </h3>
                <div className="space-y-1">
                  {categorySnippets.map((snippet) => (
                    <SnippetItem key={snippet.id} snippet={snippet} />
                  ))}
                  {category === 'custom' && categorySnippets.length === 0 && (
                    <p className="text-sm text-gray-400 dark:text-gray-500 italic py-2">No custom snippets yet</p>
                  )}
                </div>
              </div>
            );
          })}

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button onClick={() => setShowAddModal(true)} variant="secondary" className="w-full">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Custom Snippet
            </Button>
          </div>
        </div>
      </SlidePanel>

      <AddSnippetModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </>
  );
}
