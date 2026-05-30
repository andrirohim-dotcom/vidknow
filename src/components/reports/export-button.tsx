'use client';

import { useState } from 'react';

interface ExportButtonProps {
  extractionId: string;
  disabled?: boolean;
}

export function ExportButton({ extractionId, disabled }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showFormatSelector, setShowFormatSelector] = useState(false);

  const handleExport = async (format: 'html' | 'pdf') => {
    setIsExporting(true);
    setShowFormatSelector(false);

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ extraction_id: extractionId, format }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to start export');
      }

      // Poll for completion
      pollExportStatus(data.data.id);
    } catch (error) {
      console.error('Export error:', error);
      setIsExporting(false);
    }
  };

  const pollExportStatus = async (exportId: string) => {
    const maxAttempts = 30;
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`/api/export/${exportId}`);
        const data = await response.json();

        if (data.data.status === 'completed') {
          setIsExporting(false);
          // Trigger download
          if (data.data.file_url) {
            window.open(data.data.file_url, '_blank');
          }
          return;
        }

        if (data.data.status === 'failed') {
          setIsExporting(false);
          console.error('Export failed');
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 1000);
        } else {
          setIsExporting(false);
        }
      } catch {
        setIsExporting(false);
      }
    };

    poll();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowFormatSelector(!showFormatSelector)}
        disabled={disabled || isExporting}
        className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? 'Exporting...' : 'Export'}
      </button>

      {showFormatSelector && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <button
            onClick={() => handleExport('html')}
            className="block w-full text-left px-4 py-2 hover:bg-gray-50 rounded-t-lg"
          >
            HTML
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="block w-full text-left px-4 py-2 hover:bg-gray-50 rounded-b-lg"
          >
            PDF
          </button>
        </div>
      )}
    </div>
  );
}