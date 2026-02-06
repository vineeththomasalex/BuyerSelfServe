import React, { useState, useEffect } from 'react';
import { useTransaction } from '../../hooks/useTransaction';
import { usePdfFiller } from '../../hooks/usePdfFiller';
import { getDocumentById } from '../../data/documents';
import { Modal, Button, Input, TextArea } from '../common';
import { SavedPDFList } from './SavedPDFList';

interface PDFFillerModalProps {
  documentId: string | null;
  onClose: () => void;
}

interface FieldInfo {
  name: string;
  type: 'text' | 'checkbox' | 'unknown';
  snippetValue?: string;
  snippetLabel?: string;
}

export function PDFFillerModal({ documentId, onClose }: PDFFillerModalProps) {
  const { snippets, savePDF, getSavedPDFsByDocument } = useTransaction();
  const {
    loading,
    error,
    pdfDoc,
    loadPdf,
    fillFields,
    downloadPdf,
    getPdfBase64,
    loadFromBase64,
    reset,
  } = usePdfFiller();

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [draftName, setDraftName] = useState('');
  const [showSavedList, setShowSavedList] = useState(false);
  const [detectedFields, setDetectedFields] = useState<FieldInfo[]>([]);
  const [isFilling, setIsFilling] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const document = documentId ? getDocumentById(documentId) : null;
  const savedPDFs = documentId ? getSavedPDFsByDocument(documentId) : [];

  // Detect fields from loaded PDF
  useEffect(() => {
    if (pdfDoc && document) {
      try {
        const form = pdfDoc.getForm();
        const fields = form.getFields();

        const fieldInfos: FieldInfo[] = fields.map((field) => {
          const name = field.getName();
          const fieldType = field.constructor.name;

          // Try to find a snippet mapping
          const mapping = document.formFields.find(
            (f) => f.pdfFieldName.toLowerCase() === name.toLowerCase()
          );

          let snippetValue: string | undefined;
          let snippetLabel: string | undefined;

          if (mapping) {
            const snippet = snippets.find(
              (s) => s.category === mapping.snippetCategory && s.label === mapping.snippetLabel
            );
            if (snippet) {
              snippetValue = snippet.value;
              snippetLabel = snippet.label;
            }
          }

          return {
            name,
            type: fieldType === 'PDFTextField' ? 'text' : fieldType === 'PDFCheckBox' ? 'checkbox' : 'unknown',
            snippetValue,
            snippetLabel,
          };
        });

        setDetectedFields(fieldInfos);

        // Initialize form data with snippet values where available
        const initialData: Record<string, string> = {};
        fieldInfos.forEach((field) => {
          if (field.snippetValue) {
            initialData[field.name] = field.snippetValue;
          }
        });
        setFormData((prev) => ({ ...initialData, ...prev }));
      } catch (e) {
        console.warn('Could not read PDF form fields:', e);
        setDetectedFields([]);
      }
    }
  }, [pdfDoc, document, snippets]);

  useEffect(() => {
    if (document) {
      // Load the blank PDF
      const pdfPath = import.meta.env.BASE_URL + document.localPdfPath.replace(/^\//, '');
      loadPdf(pdfPath);
      setDraftName(`${document.name} - Draft`);
      setFormData({});
      setDetectedFields([]);
      setSaveMessage(null);
    }

    return () => {
      reset();
      setFormData({});
      setDetectedFields([]);
    };
  }, [documentId]);

  if (!document) return null;

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    setSaveMessage(null);
  };

  const handleAutoFill = () => {
    const autoFilledData: Record<string, string> = { ...formData };
    detectedFields.forEach((field) => {
      if (field.snippetValue && !autoFilledData[field.name]) {
        autoFilledData[field.name] = field.snippetValue;
      }
    });
    setFormData(autoFilledData);
    setSaveMessage(null);
  };

  const handleClearAll = () => {
    setFormData({});
    setSaveMessage(null);
  };

  const handleFillAndDownload = async () => {
    setIsFilling(true);
    try {
      // Reload the PDF fresh to avoid cumulative issues
      const pdfPath = import.meta.env.BASE_URL + document.localPdfPath.replace(/^\//, '');
      await loadPdf(pdfPath);

      // Small delay to ensure PDF is loaded
      await new Promise(resolve => setTimeout(resolve, 100));

      await fillFields(formData);
      downloadPdf(`${document.name.replace(/\s+/g, '_')}_filled.pdf`);
    } catch (e) {
      console.error('Error downloading PDF:', e);
    } finally {
      setIsFilling(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsFilling(true);
    try {
      // Reload fresh and fill
      const pdfPath = import.meta.env.BASE_URL + document.localPdfPath.replace(/^\//, '');
      await loadPdf(pdfPath);
      await new Promise(resolve => setTimeout(resolve, 100));

      await fillFields(formData);
      const base64 = getPdfBase64();
      if (base64) {
        savePDF({
          documentId: document.id,
          name: draftName || `${document.name} - Draft`,
          filledData: formData,
          pdfBase64: base64,
        });
        setSaveMessage('Draft saved successfully!');
      }
    } catch (e) {
      console.error('Error saving draft:', e);
      setSaveMessage('Error saving draft');
    } finally {
      setIsFilling(false);
    }
  };

  const handleLoadDraft = async (pdfBase64: string, filledData: Record<string, string>) => {
    setFormData(filledData);
    setShowSavedList(false);
    setSaveMessage('Draft loaded - you can continue editing');
  };

  // Group fields by whether they have snippet mappings
  const mappedFields = detectedFields.filter((f) => f.snippetLabel);
  const unmappedFields = detectedFields.filter((f) => !f.snippetLabel);
  const filledCount = Object.values(formData).filter((v) => v && v.trim() !== '').length;

  return (
    <Modal
      isOpen={!!documentId}
      onClose={onClose}
      title={`Fill: ${document.name}`}
      size="xl"
    >
      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        {/* Header Info */}
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {document.trecFormNumber && <span className="font-medium">{document.trecFormNumber} • </span>}
              {detectedFields.length > 0 ? (
                <span>{filledCount} of {detectedFields.length} fields filled</span>
              ) : (
                <span>Loading form fields...</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {savedPDFs.length > 0 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowSavedList(!showSavedList)}
              >
                Load Draft ({savedPDFs.length})
              </Button>
            )}
            <a
              href={document.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Official Form ↗
            </a>
          </div>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={`text-sm p-2 rounded ${saveMessage.includes('Error') ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'}`}>
            {saveMessage}
          </div>
        )}

        {/* Saved Drafts List */}
        {showSavedList && (
          <SavedPDFList
            savedPDFs={savedPDFs}
            onLoad={handleLoadDraft}
            onClose={() => setShowSavedList(false)}
          />
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Loading PDF form...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg">
            <p className="font-medium">Error loading PDF</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Form Fields */}
        {!loading && !error && detectedFields.length > 0 && (
          <>
            {/* Quick Actions */}
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <Button variant="secondary" size="sm" onClick={handleAutoFill}>
                Auto-fill from Snippets
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClearAll}>
                Clear All
              </Button>
            </div>

            {/* Mapped Fields (with snippet hints) */}
            {mappedFields.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Fields with Snippets ({mappedFields.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {mappedFields.map((field) => (
                    <div key={field.name} className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
                      {field.type === 'checkbox' ? (
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData[field.name] === 'true'}
                            onChange={(e) => handleFieldChange(field.name, e.target.checked ? 'true' : 'false')}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{field.name}</span>
                        </label>
                      ) : (
                        <Input
                          label={
                            <span>
                              {field.name}
                              {field.snippetLabel && (
                                <span className="text-xs text-green-600 dark:text-green-400 ml-2">
                                  (from {field.snippetLabel})
                                </span>
                              )}
                            </span>
                          }
                          value={formData[field.name] || ''}
                          onChange={(e) => handleFieldChange(field.name, e.target.value)}
                          placeholder={field.snippetValue || `Enter ${field.name}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Unmapped Fields */}
            {unmappedFields.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  Other Form Fields ({unmappedFields.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {unmappedFields.map((field) => (
                    <div key={field.name}>
                      {field.type === 'checkbox' ? (
                        <label className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <input
                            type="checkbox"
                            checked={formData[field.name] === 'true'}
                            onChange={(e) => handleFieldChange(field.name, e.target.checked ? 'true' : 'false')}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{field.name}</span>
                        </label>
                      ) : (
                        <Input
                          label={field.name}
                          value={formData[field.name] || ''}
                          onChange={(e) => handleFieldChange(field.name, e.target.value)}
                          placeholder={`Enter ${field.name}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* No Fields Detected */}
        {!loading && !error && detectedFields.length === 0 && pdfDoc && (
          <div className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 p-4 rounded-lg">
            <p className="font-medium">No fillable fields detected</p>
            <p className="text-sm mt-1">
              This PDF may not have fillable form fields, or it uses a non-standard format.
              You can still download the blank form and fill it manually.
            </p>
            <div className="mt-3">
              <a
                href={import.meta.env.BASE_URL + document.localPdfPath.replace(/^\//, '')}
                download={`${document.name.replace(/\s+/g, '_')}_blank.pdf`}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
              >
                Download Blank PDF
              </a>
            </div>
          </div>
        )}

        {/* Save Draft Section */}
        {detectedFields.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Input
                  label="Save progress as draft"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="Draft name"
                />
              </div>
              <Button variant="secondary" onClick={handleSaveDraft} disabled={isFilling}>
                {isFilling ? 'Saving...' : 'Save Draft'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
        <Button
          onClick={handleFillAndDownload}
          disabled={loading || !!error || isFilling || detectedFields.length === 0}
        >
          {isFilling ? 'Preparing...' : 'Download Filled PDF'}
        </Button>
      </div>
    </Modal>
  );
}
