'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { videoParser } from '@/lib/video/parser';
import type { Profile } from '@/types';

interface UrlInputProps {
  onExtract: (url: string, profileId: string) => void;
  disabled?: boolean;
}

export function UrlInput({ onExtract, disabled }: UrlInputProps) {
  const supabase = createClient();
  const [url, setUrl] = useState('');
  const [profileId, setProfileId] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('name', { ascending: true });

      if (fetchError) throw fetchError;

      setProfiles(data || []);

      // Auto-select default profile
      const defaultProfile = data?.find(p => p.is_default);
      if (defaultProfile) {
        setProfileId(defaultProfile.id);
      }
    } catch (err) {
      console.error('Error fetching profiles:', err);
    } finally {
      setIsLoadingProfiles(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a video URL');
      return;
    }

    if (!videoParser.isValidUrl(url)) {
      setError('Invalid URL. Please enter a YouTube, X.com, or TikTok video URL');
      return;
    }

    if (!profileId) {
      setError('Please select a profile');
      return;
    }

    onExtract(url, profileId);
    setUrl('');
  };

  const platform = videoParser.detectPlatform(url);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
          Video URL
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          disabled={disabled}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
        />
        {platform && (
          <p className="mt-1 text-sm text-green-600">
            Detected: {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="profile" className="block text-sm font-medium text-gray-700 mb-2">
          Profile
        </label>
        <select
          id="profile"
          value={profileId}
          onChange={(e) => setProfileId(e.target.value)}
          disabled={disabled || isLoadingProfiles}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
        >
          <option value="">
            {isLoadingProfiles ? 'Loading profiles...' : 'Select a profile'}
          </option>
          {profiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.name} {profile.is_default ? '(Default)' : ''}
            </option>
          ))}
        </select>
        {!isLoadingProfiles && profiles.length === 0 && (
          <p className="mt-1 text-sm text-gray-500">
            No profiles found.{' '}
            <a href="/profiles" className="text-indigo-600 hover:text-indigo-800">
              Create one
            </a>
          </p>
        )}
      </div>

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={disabled || isLoadingProfiles}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {disabled ? 'Extracting...' : 'Extract Knowledge'}
      </button>
    </form>
  );
}