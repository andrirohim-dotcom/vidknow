import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { NotFoundError, ValidationError, handleError } from '@/lib/utils/error';
import { logger } from '@/lib/utils/logger';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      );
    }

    const { id } = await params;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      throw new NotFoundError('Profile', id);
    }

    return NextResponse.json({ data: profile });
  } catch (error) {
    const appError = handleError(error);
    logger.error('Get profile error', appError);
    return NextResponse.json(
      { error: { code: appError.code, message: appError.message } },
      { status: appError.statusCode }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      throw new NotFoundError('Profile', id);
    }

    const { name, description, avatar_url, color, sort_order } = body;

    const updates: Record<string, unknown> = {};
    if (name !== undefined) {
      if (!name) throw new ValidationError('Profile name cannot be empty');
      if (name.length > 100) throw new ValidationError('Profile name must be 100 characters or less');
      updates.name = name;
    }
    if (description !== undefined) updates.description = description || null;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url || null;
    if (color !== undefined) {
      if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
        throw new ValidationError('Invalid color format');
      }
      updates.color = color;
    }
    if (sort_order !== undefined) updates.sort_order = sort_order;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ data: profile });
    }

    updates.updated_at = new Date().toISOString();

    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      logger.error('Failed to update profile', updateError);
      throw new Error('Failed to update profile');
    }

    return NextResponse.json({
      data: {
        ...updatedProfile,
        updated_fields: Object.keys(updates).filter(k => k !== 'updated_at'),
      },
    });
  } catch (error) {
    const appError = handleError(error);
    logger.error('Update profile error', appError);
    return NextResponse.json(
      { error: { code: appError.code, message: appError.message } },
      { status: appError.statusCode }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      );
    }

    const { id } = await params;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      throw new NotFoundError('Profile', id);
    }

    if (profile.is_default) {
      throw new ValidationError('Cannot delete default profile');
    }

    // Delete all knowledge extractions for this profile
    const { error: deleteExtractionsError } = await supabase
      .from('knowledge_extractions')
      .delete()
      .eq('profile_id', id);

    if (deleteExtractionsError) {
      logger.error('Failed to delete profile extractions', deleteExtractionsError);
    }

    // Delete the profile
    const { error: deleteProfileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (deleteProfileError) {
      logger.error('Failed to delete profile', deleteProfileError);
      throw new Error('Failed to delete profile');
    }

    return NextResponse.json({
      data: {
        deleted: true,
        deleted_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    const appError = handleError(error);
    logger.error('Delete profile error', appError);
    return NextResponse.json(
      { error: { code: appError.code, message: appError.message } },
      { status: appError.statusCode }
    );
  }
}