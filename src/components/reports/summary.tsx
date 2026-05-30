'use client';

interface SummaryProps {
  summary: string;
}

export function Summary({ summary }: SummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Summary</h2>
      <div className="prose max-w-none">
        <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
      </div>
    </div>
  );
}