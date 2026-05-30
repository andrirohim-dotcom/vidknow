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
        progress_percent,
        video_source:video_sources(
          id,
          platform,
          title,
          thumbnail_url
        ),
        error_message,
        created_at,
        updated_at
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (extractionError || !extraction) {
      throw new NotFoundError('Extraction', id);
    }

    // Get report ID if completed
    let reportId = null;
    if (extraction.status === 'completed') {
      const { data: report } = await supabase
        .from('knowledge_reports')
        .select('id')
        .eq('extraction_id', id)
        .single();

      reportId = report?.id;
    }

    return NextResponse.json({
      data: {
        id: extraction.id,
        status: extraction.status,
        progress_percent: extraction.progress_percent,
        video_source: extraction.video_source,
        report_id: reportId,
        error_message: extraction.error_message,
        created_at: extraction.created_at,
        updated_at: extraction.updated_at,
      },
    });
  } catch (error) {
    const appError = handleError(error);
    logger.error('Get extraction error', appError);
    return NextResponse.json(
      { error: { code: appError.code, message: appError.message } },
      { status: appError.statusCode }
    );
  }
}