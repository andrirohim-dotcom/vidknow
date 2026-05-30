'use client';

import type { Profile } from '@/types';

interface ProfileCardProps {
  profile: Profile;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProfileCard({ profile, onEdit, onDelete }: ProfileCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div
        className="h-2"
        style={{ backgroundColor: profile.color }}
      />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">{profile.name}</h3>
          {profile.is_default && (
            <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs font-medium">
              Default
            </span>
          )}
        </div>

        {profile.description && (
          <p className="text-gray-600 text-sm mb-3">{profile.description}</p>
        )}

        <div className="text-sm text-gray-500 mb-4">
          {(profile as Profile & { knowledge_count?: number }).knowledge_count || 0} knowledge items
        </div>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 text-sm"
          >
            Edit
          </button>
          {!profile.is_default && (
            <button
              onClick={onDelete}
              className="flex-1 border border-red-300 text-red-600 py-2 px-3 rounded-lg hover:bg-red-50 text-sm"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}