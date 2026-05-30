'use client';

import type { DifficultyLevel } from '@/types';

interface DifficultyIndicatorProps {
  level: DifficultyLevel;
}

export function DifficultyIndicator({ level }: DifficultyIndicatorProps) {
  const getDifficultyConfig = (level: DifficultyLevel) => {
    switch (level) {
      case 'beginner':
        return {
          label: 'Beginner',
          color: 'bg-green-100 text-green-800',
          description: 'No prior experience needed',
        };
      case 'intermediate':
        return {
          label: 'Intermediate',
          color: 'bg-yellow-100 text-yellow-800',
          description: 'Some experience recommended',
        };
      case 'advanced':
        return {
          label: 'Advanced',
          color: 'bg-red-100 text-red-800',
          description: 'Expert knowledge required',
        };
      default:
        return {
          label: 'Unknown',
          color: 'bg-gray-100 text-gray-800',
          description: 'Difficulty level not specified',
        };
    }
  };

  const config = getDifficultyConfig(level);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-semibold mb-2">Difficulty Level</h3>
      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </div>
      <p className="text-gray-600 text-sm mt-2">{config.description}</p>
    </div>
  );
}