import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { handleError } from '@/lib/utils/error';
import { logger } from '@/lib/utils/logger';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const profileId = searchParams.get('profile_id');
    const categoryId = searchParams.get('category_id');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || '-created_at';

    const offset = (page - 1) * limit;

    let query = supabase
      .from('knowledge_extractions')
      .select(`
        id,
        status,
        created_at,
        video_source:video_sources(
          title,
          platform,
          thumbnail_url
        ),
        report:knowledge_reports(
          summary,
          difficulty_level,
          relevance_score
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'completed');

    if (profileId) {
      query = query.eq('profile_id', profileId);
    }

    if (difficulty) {
      query = query.eq('report.difficulty_level', difficulty);
    }

    if (search) {
      query = query.ilike('video_source.title', `%${search}%`);
    }

    // Apply sorting
    const ascending = !sort.startsWith('-');
    const sortField = sort.replace('-', '');
    query = query.order(sortField, { ascending });

    // Get total count
    const { count, error: countError } = await supabase
      .from('knowledge_extractions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'completed');

    if (countError) {
      logger.error('Failed to count extractions', countError);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: items, error: itemsError } = await query;

    if (itemsError) {
      logger.error('Failed to fetch knowledge items', itemsError);
      throw new Error('Failed to fetch knowledge items');
    }

    // Filter by category if specified
    let filteredItems = items;
    if (categoryId) {
      const { data: categoryItems } = await supabase
        .from('knowledge_item_categories')
        .select('extraction_id')
        .eq('category_id', categoryId);

      const categoryIds = categoryItems?.map((ci) => ci.extraction_id) || [];
      filteredItems = items.filter((item) => categoryIds.includes(item.id));
    }

    return NextResponse.json({
      data: filteredItems,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    const appError = handleError(error);
    logger.error('Get knowledge list error', appError);
    return NextResponse.json(
      { error: { code: appError.code, message: appError.message } },
      { status: appError.statusCode }
    );
  }
}