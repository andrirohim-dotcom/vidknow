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

    const { data: report, error: reportError } = await supabase
      .from('knowledge_reports')
      .select(`
        id,
        extraction_id,
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
        warnings,
        created_at,
        extraction:knowledge_extractions(
          video_source:video_sources(
            title,
            platform,
            thumbnail_url,
            url,
            channel_name
          )
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (reportError || !report) {
      throw new NotFoundError('Report', id);
    }

    return NextResponse.json({ data: report });
  } catch (error) {
    const appError = handleError(error);
    logger.error('Get report error', appError);
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

    const { data: report, error: reportError } = await supabase
      .from('knowledge_reports')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (reportError || !report) {
      throw new NotFoundError('Report', id);
    }

    const { relevance_score, feasibility_score, value_score, categories } = body;

    const updates: Record<string, unknown> = {};
    if (relevance_score !== undefined) updates.relevance_score = relevance_score;
    if (feasibility_score !== undefined) updates.feasibility_score = feasibility_score;
    if (value_score !== undefined) updates.value_score = value_score;

    if (Object.keys(updates).length > 0) {
      const { error: updateError } = await supabase
        .from('knowledge_reports')
        .update(updates)
        .eq('id', id);

      if (updateError) {
        logger.error('Failed to update report', updateError);
        throw new Error('Failed to update report');
      }
    }

    // Update categories if provided
    if (categories && Array.isArray(categories)) {
      // Get extraction_id from report
      const { data: reportData } = await supabase
        .from('knowledge_reports')
        .select('extraction_id')
        .eq('id', id)
        .single();

      if (reportData) {
        // Delete existing categories
        await supabase
          .from('knowledge_item_categories')
          .delete()
          .eq('extraction_id', reportData.extraction_id);

        // Insert new categories
        if (categories.length > 0) {
          const categoryInserts = categories.map((categoryId: string) => ({
            extraction_id: reportData.extraction_id,
            category_id: categoryId,
          }));

          await supabase
            .from('knowledge_item_categories')
            .insert(categoryInserts);
        }
      }
    }

    return NextResponse.json({
      data: {
        id,
        updated_fields: Object.keys(updates),
        updated_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    const appError = handleError(error);
    logger.error('Update report error', appError);
    return NextResponse.json(
      { error: { code: appError.code, message: appError.message } },
      { status: appError.statusCode }
    );
  }
}