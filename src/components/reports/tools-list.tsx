'use client';

import type { Tool } from '@/types';

interface ToolsListProps {
  tools: Tool[];
}

export function ToolsList({ tools }: ToolsListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Required Tools</h2>
      <div className="space-y-3">
        {tools.map((tool, index) => (
          <div
            key={index}
            className="flex items-start justify-between p-3 border border-gray-200 rounded-lg"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{tool.name}</h3>
                {tool.required && (
                  <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-medium">
                    Required
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm mt-1">{tool.description}</p>
            </div>
            {tool.url && (
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 text-sm ml-4"
              >
                Visit →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}