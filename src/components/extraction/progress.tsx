'use client';

import { useEffect, useState } from 'react';

interface ExtractionProgressProps {
  extractionId: string;
}

export function ExtractionProgress({ extractionId }: ExtractionProgressProps) {
  const [status, setStatus] = useState<string>('pending');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/extract/${extractionId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || 'Failed to get status');
        }

        setStatus(data.data.status);
        setProgress(data.data.progress_percent);

        if (data.data.status === 'completed') {
          // Redirect to report
          window.location.href = `/knowledge/${data.data.report_id}`;
          return;
        }

        if (data.data.status === 'failed') {
          setError(data.data.error_message || 'Extraction failed');
          return;
        }

        // Continue polling
        setTimeout(pollStatus, 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    pollStatus();
  }, [extractionId]);

  const getStatusMessage = () => {
    switch (status) {
      case 'pending':
        return 'Queuing extraction...';
      case 'processing':
        return 'Extracting knowledge from video...';
      case 'completed':
        return 'Extraction complete!';
      case 'failed':
        return 'Extraction failed';
      default:
        return 'Processing...';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Extraction Progress</h3>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{getStatusMessage()}</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <p className="text-sm text-gray-500 mt-4">
        You can safely navigate away. We&apos;ll notify you when it&apos;s ready.
      </p>
    </div>
  );
}