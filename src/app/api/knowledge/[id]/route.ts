import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { NotFoundError, handleError } from '@/lib/utils/error';
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

    const { data: extraction, error: extractionError } = await supabase
      .from('knowledge_extractions')
      .select(`
        id,
        status,
        created_at,
        video_source:video_sources(
          title,
          platform,
          thumbnail_url,
          url,
          channel_name,
          duration_seconds
        ),
        report:knowledge_reports(
          summary,
          key_concepts,
          implementation_steps,
          tools_list,
          difficulty_level,
          estimated_time_hours,
          prerequisites,
          learning_objectives,
          relevance_score,
          feasibility_score,
          value_score,
          warnings
        ),
        categories:knowledge_item_categories(
          category:knowledge_categories(
            id,
            name,
            color
          )
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (extractionError || !extraction) {
      throw new NotFoundError('Knowledge item', id);
    }

    return NextResponse.json({ data: extraction });
  } catch (error) {
    const appError = handleError(error);
    logger.error('Get knowledge item error', appError);
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

    // Check if extraction exists and belongs to user
    const { data: extraction, error: extractionError } = await supabase
      .from('knowledge_extractions')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (extractionError || !extraction) {
      throw new NotFoundError('Knowledge item', id);
    }

    // Delete the extraction (cascades to report and categories)
    const { error: deleteError } = await supabase
      .from('knowledge_extractions')
      .delete()
      .eq('id', id);

    if (deleteError) {
      logger.error('Failed to delete knowledge item', deleteError);
      throw new Error('Failed to delete knowledge item');
    }

    return NextResponse.json({ data: { deleted: true } });
  } catch (error) {
    const appError = handleError(error);
    logger.error('Delete knowledge item error', appError);
    return NextResponse.json(
      { error: { code: appError.code, message: appError.message } },
      { status: appError.statusCode }
    );
  }
}