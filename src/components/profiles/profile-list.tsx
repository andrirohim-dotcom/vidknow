'use client';

import { ProfileCard } from './profile-card';
import type { Profile } from '@/types';

interface ProfileListProps {
  profiles: Profile[];
  onEdit: (profile: Profile) => void;
  onDelete: (profileId: string) => void;
}

export function ProfileList({ profiles, onEdit, onDelete }: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No profiles yet.</p>
          <p className="text-gray-500">
            Create your first profile to organize your knowledge.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          onEdit={() => onEdit(profile)}
          onDelete={() => onDelete(profile.id)}
        />
      ))}
    </div>
  );
}