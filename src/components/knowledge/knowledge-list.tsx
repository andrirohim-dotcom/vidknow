'use client';

import { KnowledgeCard } from './knowledge-card';
import type { KnowledgeExtraction } from '@/types';

interface KnowledgeListProps {
  items: KnowledgeExtraction[];
  isLoading: boolean;
}

export function KnowledgeList({ items, isLoading }: KnowledgeListProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">Loading knowledge items...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No knowledge items found.</p>
          <a
            href="/extract"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Extract your first video
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <KnowledgeCard key={item.id} item={item} />
      ))}
    </div>
  );
}