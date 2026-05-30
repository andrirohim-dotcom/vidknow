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

    const { data: exportRecord, error: exportError } = await supabase
      .from('exports')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (exportError || !exportRecord) {
      throw new NotFoundError('Export', id);
    }

    return NextResponse.json({ data: exportRecord });
  } catch (error) {
    const appError = handleError(error);
    logger.error('Get export error', appError);
    return NextResponse.json(
      { error: { code: appError.code, message: appError.message } },
      { status: appError.statusCode }
    );
  }
}