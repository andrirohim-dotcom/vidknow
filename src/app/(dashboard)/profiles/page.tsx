'use client';

import { useEffect, useState } from 'react';
import { ProfileList } from '@/components/profiles/profile-list';
import { ProfileForm } from '@/components/profiles/profile-form';
import { useProfileStore } from '@/stores/profile';
import type { Profile } from '@/types';

export default function ProfilesPage() {
  const { profiles, setProfiles, addProfile, updateProfile, removeProfile } = useProfileStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await fetch('/api/profiles');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch profiles');
      }

      setProfiles(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProfile = async (data: { name: string; color: string; description?: string }) => {
    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to create profile');
      }

      addProfile(result.data);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleUpdateProfile = async (data: { name: string; color: string; description?: string }) => {
    if (!editingProfile) return;

    try {
      const response = await fetch(`/api/profiles/${editingProfile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to update profile');
      }

      updateProfile(editingProfile.id, data);
      setEditingProfile(null);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (!confirm('Are you sure you want to delete this profile? All associated knowledge will be removed.')) {
      return;
    }

    try {
      const response = await fetch(`/api/profiles/${profileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || 'Failed to delete profile');
      }

      removeProfile(profileId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleEdit = (profile: Profile) => {
    setEditingProfile(profile);
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading profiles...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Profiles</h1>
          <button
            onClick={() => {
              setEditingProfile(null);
              setShowForm(true);
            }}
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
          >
            Create Profile
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingProfile ? 'Edit Profile' : 'Create New Profile'}
            </h2>
            <ProfileForm
              initialData={editingProfile}
              onSubmit={editingProfile ? handleUpdateProfile : handleCreateProfile}
              onCancel={() => {
                setEditingProfile(null);
                setShowForm(false);
              }}
            />
          </div>
        )}

        <ProfileList
          profiles={profiles}
          onEdit={handleEdit}
          onDelete={handleDeleteProfile}
        />
      </div>
    </div>
  );
}