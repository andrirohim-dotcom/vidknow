import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ValidationError, handleError } from '@/lib/utils/error';
import { logger } from '@/lib/utils/logger';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      );
    }

    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: true });

    if (profilesError) {
      logger.error('Failed to fetch profiles', profilesError);
      throw new Error('Failed to fetch profiles');
    }

    // Get knowledge count for each profile
    const profilesWithCount = await Promise.all(
      profiles.map(async (profile) => {
        const { count } = await supabase
          .from('knowledge_extractions')
          .select('*', { count: 'exact', head: true })
          .eq('profile_id', profile.id)
          .eq('status', 'completed');

        return { ...profile, knowledge_count: count || 0 };
      })
    );

    return NextResponse.json({ data: profilesWithCount });
  } catch (error) {
    const appError = handleError(error);
    logger.error('Get profiles error', appError);
    return NextResponse.json(
      { error: { code: appError.code, message: appError.message } },
      { status: appError.statusCode }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, avatar_url, color } = body;

    if (!name) {
      throw new ValidationError('Profile name is required');
    }

    if (name.length > 100) {
      throw new ValidationError('Profile name must be 100 characters or less');
    }

    if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
      throw new ValidationError('Invalid color format. Use hex color (e.g., #6366f1)');
    }

    // Check if this is the first profile (make it default)
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    const isDefault = count === 0;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        name,
        description: description || null,
        avatar_url: avatar_url || null,
        color: color || '#6366f1',
        is_default: isDefault,
        sort_order: count || 0,
      })
      .select()
      .single();

    if (profileError) {
      logger.error('Failed to create profile', profileError);
      throw new Error('Failed to create profile');
    }

    return NextResponse.json({ data: profile }, { status: 201 });
  } catch (error) {
    const appError = handleError(error);
    logger.error('Create profile error', appError);
    return NextResponse.json(
      { error: { code: appError.code, message: appError.message } },
      { status: appError.statusCode }
    );
  }
}