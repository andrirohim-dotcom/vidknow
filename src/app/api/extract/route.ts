import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { videoParser } from '@/lib/video/parser';
import { extractionService } from '@/lib/ai/extraction';
import { ValidationError, handleError } from '@/lib/utils/error';
import { logger } from '@/lib/utils/logger';

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
    const { url, profile_id, categories } = body;

    if (!url) {
      throw new ValidationError('URL is required');
    }

    if (!videoParser.isValidUrl(url)) {
      throw new ValidationError('Invalid video URL. Supported platforms: YouTube, X.com, TikTok');
    }

    if (!profile_id) {
      throw new ValidationError('Profile ID is required');
    }

    // Verify profile belongs to user
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', profile_id)
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      throw new ValidationError('Profile not found');
    }

    const platform = videoParser.detectPlatform(url);
    const videoId = videoParser.extractVideoId(url);

    if (!platform || !videoId) {
      throw new ValidationError('Could not detect video platform or extract video ID');
    }

    // Check if video source exists
    let { data: videoSource } = await supabase
      .from('video_sources')
      .select('id')
      .eq('platform', platform)
      .eq('video_id', videoId)
      .single();

    if (!videoSource) {
      // Create new video source
      const adapter = videoParser.getAdapter(url);
      if (!adapter) {
        throw new ValidationError('No adapter found for this platform');
      }

      const metadata = await adapter.getMetadata(videoId);
      const { data: newVideoSource, error: createError } = await supabase
        .from('video_sources')
        .insert({
          platform,
          url: videoParser.normalizeUrl(url),
          video_id: videoId,
          title: metadata.title,
          description: metadata.description,
          thumbnail_url: metadata.thumbnailUrl,
          duration_seconds: metadata.durationSeconds,
          channel_name: metadata.channelName,
          channel_url: metadata.channelUrl,
          published_at: metadata.publishedAt.toISOString(),
          availability_status: 'available',
        })
        .select('id')
        .single();

      if (createError) {
        logger.error('Failed to create video source', createError);
        throw new Error('Failed to create video source');
      }

      videoSource = newVideoSource;
    }

    // Create extraction record
    const { data: extraction, error: extractionError } = await supabase
      .from('knowledge_extractions')
      .insert({
        user_id: user.id,
        profile_id,
        video_source_id: videoSource.id,
        status: 'pending',
        progress_percent: 0,
      })
      .select()
      .single();

    if (extractionError) {
      logger.error('Failed to create extraction', extractionError);
      throw new Error('Failed to create extraction record');
    }

    // Start extraction process (in production, this would be a background job)
    // For now, we'll do it synchronously
    processExtraction(extraction.id, videoId, platform, url);

    return NextResponse.json({
      data: {
        id: extraction.id,
        status: 'pending',
        video_source: {
          id: videoSource.id,
          platform,
          title: extraction.video_source_id,
        },
        created_at: extraction.created_at,
      },
    });
  } catch (error) {
    const appError = handleError(error);
    logger.error('Extraction error', appError);
    return NextResponse.json(
      { error: { code: appError.code, message: appError.message } },
      { status: appError.statusCode }
    );
  }
}

async function processExtraction(
  extractionId: string,
  videoId: string,
  platform: string,
  url: string
) {
  const supabase = await createClient();

  try {
    // Update status to processing
    await supabase
      .from('knowledge_extractions')
      .update({ status: 'processing', progress_percent: 10 })
      .eq('id', extractionId);

    // Get transcript
    const adapter = videoParser.getAdapter(url);
    if (!adapter) throw new Error('No adapter found');

    const transcript = await adapter.getTranscript(videoId);
    const metadata = await adapter.getMetadata(videoId);

    // Update progress
    await supabase
      .from('knowledge_extractions')
      .update({ progress_percent: 30, transcript: transcript.fullText, transcript_language: transcript.language })
      .eq('id', extractionId);

    // Extract knowledge using AI
    const report = await extractionService.extractKnowledge({
      transcript: transcript.fullText,
      videoTitle: metadata.title,
      videoDescription: metadata.description,
      platform,
    });

    // Update progress
    await supabase
      .from('knowledge_extractions')
      .update({ progress_percent: 80 })
      .eq('id', extractionId);

    // Save report
    const { error: reportError } = await supabase
      .from('knowledge_reports')
      .insert({
        extraction_id: extractionId,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        ...report,
      });

    if (reportError) throw reportError;

    // Update extraction status
    await supabase
      .from('knowledge_extractions')
      .update({
        status: 'completed',
        progress_percent: 100,
        extracted_at: new Date().toISOString(),
      })
      .eq('id', extractionId);

    logger.info('Extraction completed', { extractionId });
  } catch (error) {
    logger.error('Extraction failed', error as Error, { extractionId });

    await supabase
      .from('knowledge_extractions')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
      })
      .eq('id', extractionId);
  }
}