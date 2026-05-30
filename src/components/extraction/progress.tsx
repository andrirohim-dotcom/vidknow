'use client';

import { useEffect, useState } from 'react';

interface ExtractionProgressProps {
  extractionId: string;
  onComplete?: () => void;
}

export function ExtractionProgress({ extractionId, onComplete }: ExtractionProgressProps) {
  const [status, setStatus] = useState<string>('pending');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

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
          onComplete?.();
          return;
        }

        if (data.data.status === 'failed') {
          setError(data.data.error_message || 'Extraction failed');
          onComplete?.();
          return;
        }

        // Continue polling
        timeoutId = setTimeout(pollStatus, 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        onComplete?.();
      }
    };

    pollStatus();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [extractionId, onComplete]);

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

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'processing':
        return '⚙️';
      case 'completed':
        return '✅';
      case 'failed':
        return '❌';
      default:
        return '⏳';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">
        {getStatusIcon()} Extraction Progress
      </h3>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{getStatusMessage()}</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              status === 'completed'
                ? 'bg-green-600'
                : status === 'failed'
                ? 'bg-red-600'
                : 'bg-indigo-600'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {status === 'processing' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-700 text-sm">
            AI is analyzing the video content and extracting knowledge...
            This may take 30-60 seconds.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {status === 'completed' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700 text-sm">
            Knowledge extraction completed successfully!
          </p>
        </div>
      )}

      <p className="text-sm text-gray-500 mt-4">
        You can safely navigate away. We&apos;ll notify you when it&apos;s ready.
      </p>
    </div>
  );
}