'use client';

import type { KeyConcept } from '@/types';

interface KeyConceptsProps {
  concepts: KeyConcept[];
}

export function KeyConcepts({ concepts }: KeyConceptsProps) {
  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Key Concepts</h2>
      <div className="space-y-4">
        {concepts.map((concept, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-lg">{concept.title}</h3>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${getImportanceColor(
                  concept.importance
                )}`}
              >
                {concept.importance.charAt(0).toUpperCase() +
                  concept.importance.slice(1)}{' '}
                Importance
              </span>
            </div>
            <p className="text-gray-600">{concept.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}