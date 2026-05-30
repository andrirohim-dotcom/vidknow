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

    const { data: categories, error: categoriesError } = await supabase
      .from('knowledge_categories')
      .select('*')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: true });

    if (categoriesError) {
      logger.error('Failed to fetch categories', categoriesError);
      throw new Error('Failed to fetch categories');
    }

    return NextResponse.json({ data: categories });
  } catch (error) {
    const appError = handleError(error);
    logger.error('Get categories error', appError);
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
    const { name, color, parent_id } = body;

    if (!name) {
      throw new ValidationError('Category name is required');
    }

    if (name.length > 100) {
      throw new ValidationError('Category name must be 100 characters or less');
    }

    if (color && !/^#[0-9A-Fa-f]{6}$/.test(color)) {
      throw new ValidationError('Invalid color format. Use hex color (e.g., #10b981)');
    }

    const { data: category, error: categoryError } = await supabase
      .from('knowledge_categories')
      .insert({
        user_id: user.id,
        name,
        color: color || '#10b981',
        parent_id: parent_id || null,
      })
      .select()
      .single();

    if (categoryError) {
      logger.error('Failed to create category', categoryError);
      throw new Error('Failed to create category');
    }

    return NextResponse.json({ data: category }, { status: 201 });
  } catch (error) {
    const appError = handleError(error);
    logger.error('Create category error', appError);
    return NextResponse.json(
      { error: { code: appError.code, message: appError.message } },
      { status: appError.statusCode }
    );
  }
}