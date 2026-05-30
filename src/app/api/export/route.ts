import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
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
    const { extraction_id, format, options } = body;

    if (!extraction_id) {
      throw new ValidationError('Extraction ID is required');
    }

    if (!format || !['html', 'pdf'].includes(format)) {
      throw new ValidationError('Format must be either "html" or "pdf"');
    }

    // Verify extraction belongs to user and has a report
    const { data: extraction, error: extractionError } = await supabase
      .from('knowledge_extractions')
      .select('id, report:knowledge_reports(id)')
      .eq('id', extraction_id)
      .eq('user_id', user.id)
      .single();

    if (extractionError || !extraction) {
      throw new ValidationError('Extraction not found');
    }

    if (!extraction.report) {
      throw new ValidationError('No report available for this extraction');
    }

    // Create export record
    const { data: exportRecord, error: exportError } = await supabase
      .from('exports')
      .insert({
        user_id: user.id,
        extraction_id,
        format,
        status: 'pending',
      })
      .select()
      .single();

    if (exportError) {
      logger.error('Failed to create export record', exportError);
      throw new Error('Failed to create export record');
    }

    // Start export process (in production, this would be a background job)
    processExport(exportRecord.id, extraction_id, format, options);

    return NextResponse.json({
      data: {
        id: exportRecord.id,
        status: 'pending',
        format,
        created_at: exportRecord.created_at,
      },
    }, { status: 201 });
  } catch (error) {
    const appError = handleError(error);
    logger.error('Create export error', appError);
    return NextResponse.json(
      { error: { code: appError.code, message: appError.message } },
      { status: appError.statusCode }
    );
  }
}

async function processExport(
  exportId: string,
  extractionId: string,
  format: string,
  options?: { include_metadata?: boolean; custom_branding?: { logo_url?: string; primary_color?: string } }
) {
  const supabase = await createClient();

  try {
    // Update status to generating
    await supabase
      .from('exports')
      .update({ status: 'generating' })
      .eq('id', exportId);

    // Get report data
    const { data: report, error: reportError } = await supabase
      .from('knowledge_reports')
      .select(`
        *,
        extraction:knowledge_extractions(
          video_source:video_sources(
            title,
            platform,
            url,
            channel_name
          )
        )
      `)
      .eq('extraction_id', extractionId)
      .single();

    if (reportError || !report) {
      throw new Error('Report not found');
    }

    // Generate export file
    let fileUrl: string;
    let fileSize: number;

    if (format === 'html') {
      const html = generateHtmlReport(report, options);
      fileSize = Buffer.byteLength(html, 'utf-8');
      // In production, upload to Supabase Storage
      fileUrl = `exports/${exportId}.html`;
    } else {
      // PDF generation would use Puppeteer or similar
      const html = generateHtmlReport(report, options);
      fileSize = Buffer.byteLength(html, 'utf-8');
      fileUrl = `exports/${exportId}.pdf`;
    }

    // Update export record
    await supabase
      .from('exports')
      .update({
        status: 'completed',
        file_url: fileUrl,
        file_size_bytes: fileSize,
        generation_duration_ms: 1000, // Mock duration
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq('id', exportId);

    logger.info('Export completed', { exportId, format });
  } catch (error) {
    logger.error('Export failed', error as Error, { exportId });

    await supabase
      .from('exports')
      .update({
        status: 'failed',
      })
      .eq('id', exportId);
  }
}

function generateHtmlReport(
  report: Record<string, unknown>,
  options?: { include_metadata?: boolean; custom_branding?: { logo_url?: string; primary_color?: string } }
): string {
  const extraction = report.extraction as { video_source: { title: string; platform: string } } | null;
  const keyConcepts = report.key_concepts as Array<{ title: string; description: string; importance: string }> || [];
  const steps = report.implementation_steps as Array<{ step: number; title: string; description: string; expected_outcome: string }> || [];
  const tools = report.tools_list as Array<{ name: string; url?: string; description: string; required: boolean }> || [];

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${extraction?.video_source?.title || 'Knowledge Report'}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #333; }
    h1, h2, h3 { color: #1a1a1a; }
    .meta { color: #666; margin-bottom: 20px; }
    .section { margin-bottom: 30px; padding: 20px; background: #f9f9f9; border-radius: 8px; }
    .concept { margin-bottom: 15px; padding: 15px; background: white; border-radius: 4px; }
    .step { display: flex; gap: 15px; margin-bottom: 15px; }
    .step-number { width: 30px; height: 30px; background: #6366f1; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .tool { margin-bottom: 10px; padding: 10px; background: white; border-radius: 4px; }
    .required { color: #dc2626; font-size: 12px; }
  </style>
</head>
<body>
  <h1>${extraction?.video_source?.title || 'Knowledge Report'}</h1>
  <p class="meta">Platform: ${extraction?.video_source?.platform || 'Unknown'} | Difficulty: ${report.difficulty_level || 'N/A'}</p>
  
  <div class="section">
    <h2>Summary</h2>
    <p>${report.summary || 'No summary available'}</p>
  </div>

  <div class="section">
    <h2>Key Concepts</h2>
    ${keyConcepts.map(c => `
      <div class="concept">
        <h3>${c.title} <span class="required">(${c.importance})</span></h3>
        <p>${c.description}</p>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2>Implementation Steps</h2>
    ${steps.map(s => `
      <div class="step">
        <div class="step-number">${s.step}</div>
        <div>
          <h3>${s.title}</h3>
          <p>${s.description}</p>
          <p><em>Expected: ${s.expected_outcome}</em></p>
        </div>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2>Required Tools</h2>
    ${tools.map(t => `
      <div class="tool">
        <strong>${t.name}</strong> ${t.required ? '<span class="required">(Required)</span>' : ''}
        <p>${t.description}</p>
        ${t.url ? `<a href="${t.url}">Learn more →</a>` : ''}
      </div>
    `).join('')}
  </div>

  ${options?.include_metadata ? `
  <div class="section">
    <h2>Metadata</h2>
    <p>Generated by VidKnow on ${new Date().toLocaleDateString()}</p>
  </div>
  ` : ''}
</body>
</html>
  `.trim();
}