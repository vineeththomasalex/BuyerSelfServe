import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';

export interface PdfFillerState {
  loading: boolean;
  error: string | null;
  pdfDoc: PDFDocument | null;
  pdfBytes: Uint8Array | null;
}

export function usePdfFiller() {
  const [state, setState] = useState<PdfFillerState>({
    loading: false,
    error: null,
    pdfDoc: null,
    pdfBytes: null,
  });

  const loadPdf = useCallback(async (pdfPath: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(pdfPath);
      if (!response.ok) {
        throw new Error(`Failed to load PDF: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pdfBytes = await pdfDoc.save();
      setState({
        loading: false,
        error: null,
        pdfDoc,
        pdfBytes: new Uint8Array(pdfBytes),
      });
      return pdfDoc;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load PDF';
      setState((prev) => ({ ...prev, loading: false, error: message }));
      return null;
    }
  }, []);

  const fillFields = useCallback(
    async (fields: Record<string, string>) => {
      if (!state.pdfDoc) {
        setState((prev) => ({ ...prev, error: 'No PDF loaded' }));
        return null;
      }

      try {
        const form = state.pdfDoc.getForm();
        const formFields = form.getFields();

        for (const [fieldName, value] of Object.entries(fields)) {
          try {
            const field = formFields.find(
              (f) => f.getName().toLowerCase() === fieldName.toLowerCase()
            );
            if (field) {
              const fieldType = field.constructor.name;
              if (fieldType === 'PDFTextField') {
                form.getTextField(field.getName()).setText(value);
              } else if (fieldType === 'PDFCheckBox') {
                if (value === 'true' || value === '1' || value === 'yes') {
                  form.getCheckBox(field.getName()).check();
                } else {
                  form.getCheckBox(field.getName()).uncheck();
                }
              }
            }
          } catch {
            // Field might not exist or have different type
            console.warn(`Could not fill field: ${fieldName}`);
          }
        }

        const pdfBytes = await state.pdfDoc.save();
        setState((prev) => ({ ...prev, pdfBytes: new Uint8Array(pdfBytes) }));
        return new Uint8Array(pdfBytes);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fill PDF';
        setState((prev) => ({ ...prev, error: message }));
        return null;
      }
    },
    [state.pdfDoc]
  );

  const getFieldNames = useCallback((): string[] => {
    if (!state.pdfDoc) return [];
    try {
      const form = state.pdfDoc.getForm();
      return form.getFields().map((f) => f.getName());
    } catch {
      return [];
    }
  }, [state.pdfDoc]);

  const downloadPdf = useCallback(
    (filename: string) => {
      if (!state.pdfBytes) return;

      const blob = new Blob([new Uint8Array(state.pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    [state.pdfBytes]
  );

  const getPdfBase64 = useCallback((): string | null => {
    if (!state.pdfBytes) return null;
    let binary = '';
    const bytes = state.pdfBytes;
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }, [state.pdfBytes]);

  const loadFromBase64 = useCallback(async (base64: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const pdfDoc = await PDFDocument.load(bytes);
      setState({
        loading: false,
        error: null,
        pdfDoc,
        pdfBytes: bytes,
      });
      return pdfDoc;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load PDF';
      setState((prev) => ({ ...prev, loading: false, error: message }));
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      loading: false,
      error: null,
      pdfDoc: null,
      pdfBytes: null,
    });
  }, []);

  return {
    ...state,
    loadPdf,
    fillFields,
    getFieldNames,
    downloadPdf,
    getPdfBase64,
    loadFromBase64,
    reset,
  };
}
