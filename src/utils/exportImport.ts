const STORAGE_PREFIX = 'txbuyer_';
const EXPORT_VERSION = 1;

interface ExportData {
  version: number;
  timestamp: string;
  data: Record<string, unknown>;
}

/**
 * Collects all localStorage data with the txbuyer_ prefix
 */
export function exportAllData(): ExportData {
  const data: Record<string, unknown> = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      const shortKey = key.slice(STORAGE_PREFIX.length);
      try {
        const value = localStorage.getItem(key);
        if (value !== null) {
          data[shortKey] = JSON.parse(value);
        }
      } catch {
        // If JSON parsing fails, store as raw string
        const value = localStorage.getItem(key);
        if (value !== null) {
          data[shortKey] = value;
        }
      }
    }
  }

  return {
    version: EXPORT_VERSION,
    timestamp: new Date().toISOString(),
    data,
  };
}

/**
 * Creates a downloadable blob from export data
 */
function createExportBlob(): Blob {
  const exportData = exportAllData();
  const json = JSON.stringify(exportData, null, 2);
  return new Blob([json], { type: 'application/json' });
}

/**
 * Generates the backup filename with current date
 */
function getExportFilename(): string {
  const date = new Date().toISOString().split('T')[0];
  return `buyerselfserve-backup-${date}.json`;
}

/**
 * Triggers download of the export file
 * @param openDrive - If true, opens Google Drive in a new tab after download
 */
export function downloadExport(openDrive?: boolean): void {
  const blob = createExportBlob();
  const url = URL.createObjectURL(blob);
  const filename = getExportFilename();

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  if (openDrive) {
    window.open('https://drive.google.com/drive/my-drive', '_blank');
  }
}

/**
 * Checks if Web Share API is available and supports file sharing
 */
export function canUseWebShare(): boolean {
  if (!navigator.canShare) {
    return false;
  }

  // Create a test file to check if file sharing is supported
  const testFile = new File(['test'], 'test.json', { type: 'application/json' });
  return navigator.canShare({ files: [testFile] });
}

/**
 * Shares the export data using the Web Share API (for mobile devices)
 */
export async function shareData(): Promise<void> {
  const blob = createExportBlob();
  const filename = getExportFilename();
  const file = new File([blob], filename, { type: 'application/json' });

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: 'Buyer Self Serve Backup',
    });
  } else {
    throw new Error('Web Share API is not supported on this device');
  }
}

/**
 * Validates the structure of imported data
 */
function validateImportData(data: unknown): data is ExportData {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.version !== 'number') {
    return false;
  }

  if (typeof obj.timestamp !== 'string') {
    return false;
  }

  if (typeof obj.data !== 'object' || obj.data === null) {
    return false;
  }

  return true;
}

/**
 * Imports data from a backup file and restores it to localStorage
 * @param file - The JSON backup file to import
 * @returns Promise that resolves when import is complete
 */
export async function importData(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (!validateImportData(parsed)) {
          reject(new Error('Invalid backup file format'));
          return;
        }

        // Clear existing data before import
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key?.startsWith(STORAGE_PREFIX)) {
            localStorage.removeItem(key);
          }
        }

        // Restore each key from backup
        for (const [key, value] of Object.entries(parsed.data)) {
          const fullKey = `${STORAGE_PREFIX}${key}`;
          localStorage.setItem(fullKey, JSON.stringify(value));
        }

        resolve();
      } catch (error) {
        if (error instanceof SyntaxError) {
          reject(new Error('Invalid JSON file'));
        } else if (error instanceof Error) {
          reject(error);
        } else {
          reject(new Error('Failed to import backup'));
        }
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}
