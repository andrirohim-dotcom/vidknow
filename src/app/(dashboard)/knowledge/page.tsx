'use client';

import { useEffect, useState } from 'react';
import { KnowledgeList } from '@/components/knowledge/knowledge-list';
import { SearchBar } from '@/components/knowledge/search-bar';
import { CategoryFilter } from '@/components/knowledge/category-filter';
import { useKnowledgeStore } from '@/stores/knowledge';
import type { KnowledgeExtraction, KnowledgeCategory } from '@/types';

export default function KnowledgePage() {
  const { items, setItems, categories, setCategories, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useKnowledgeStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchItems();
  }, [page, searchQuery, selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (searchQuery) {
        params.set('search', searchQuery);
      }

      if (selectedCategory) {
        params.set('category_id', selectedCategory);
      }

      const response = await fetch(`/api/knowledge?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch knowledge items');
      }

      setItems(data.data);
      setTotalPages(data.pagination.pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();

      if (response.ok) {
        setCategories(data.data);
      }
    } catch {
      // Categories are optional, don't block the page
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Knowledge Library</h1>
          <a
            href="/extract"
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
          >
            Extract New
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
            </div>
            <div className="w-full md:w-64">
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onChange={handleCategoryChange}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <KnowledgeList items={items} isLoading={isLoading} />

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}