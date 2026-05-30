'use client';

import type { KnowledgeCategory } from '@/types';

interface CategoryFilterProps {
  categories: KnowledgeCategory[];
  selectedCategory: string | null;
  onChange: (categoryId: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onChange,
}: CategoryFilterProps) {
  return (
    <select
      value={selectedCategory || ''}
      onChange={(e) => onChange(e.target.value || null)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    >
      <option value="">All Categories</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
}