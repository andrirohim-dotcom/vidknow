'use client';

import { useState } from 'react';
import { UrlInput } from '@/components/extraction/url-input';
import { ExtractionProgress } from '@/components/extraction/progress';
import { useExtractionStore } from '@/stores/extraction';

export default function ExtractPage() {
  const { isExtracting, error, setExtracting, setError } = useExtractionStore();
  const [extractionId, setExtractionId] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleExtract = async (url: string, profileId: string) => {
    setLocalError(null);
    setExtracting(true);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, profile_id: profileId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to start extraction');
      }

      setExtractionId(data.data.id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setLocalError(errorMessage);
      setExtracting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Extract Knowledge</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Paste Video URL</h2>
          <p className="text-gray-600 mb-4">
            Enter a YouTube, X.com, or TikTok video URL to extract knowledge.
          </p>
          <UrlInput onExtract={handleExtract} disabled={isExtracting} />
        </div>

        {(localError || error) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-700">{localError || error}</p>
          </div>
        )}

        {isExtracting && extractionId && (
          <ExtractionProgress
            extractionId={extractionId}
            onComplete={() => setExtracting(false)}
          />
        )}

        {!isExtracting && extractionId && !localError && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Extraction Complete! ✅
            </h3>
            <p className="text-green-700 mb-4">
              Your knowledge has been extracted successfully.
            </p>
            <a
              href={`/knowledge/${extractionId}`}
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              View Report
            </a>
          </div>
        )}
      </div>
    </div>
  );
}