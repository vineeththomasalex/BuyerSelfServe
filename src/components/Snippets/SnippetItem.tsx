import React, { useState } from 'react';
import { Snippet } from '../../types';
import { useTransaction } from '../../hooks/useTransaction';
import { Button, Input } from '../common';

interface SnippetItemProps {
  snippet: Snippet;
}

export function SnippetItem({ snippet }: SnippetItemProps) {
  const { updateSnippet, deleteSnippet } = useTransaction();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(snippet.value);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!snippet.value) return;
    try {
      await navigator.clipboard.writeText(snippet.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSave = () => {
    updateSnippet(snippet.id, { value: editValue });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(snippet.value);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (snippet.category === 'custom') {
      if (confirm('Delete this snippet?')) {
        deleteSnippet(snippet.id);
      }
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="flex items-start justify-between p-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{snippet.label}</p>
          {isEditing ? (
            <div className="mt-2">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="Enter value..."
                className="w-full"
              />
              <div className="flex items-center gap-2 mt-2">
                <Button size="sm" onClick={handleSave}>
                  Save
                </Button>
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-900 dark:text-gray-100 mt-1 break-words">
              {snippet.value || (
                <span className="text-gray-400 dark:text-gray-500 italic">Not set</span>
              )}
            </p>
          )}
        </div>
        {!isEditing && (
          <div className="flex items-center gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              disabled={!snippet.value}
              className="!px-2"
            >
              {copied ? (
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="!px-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </Button>
            {snippet.category === 'custom' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="!px-2 text-red-600 hover:text-red-700"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
