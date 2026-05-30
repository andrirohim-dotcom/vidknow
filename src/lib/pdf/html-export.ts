import type { KnowledgeReport } from '@/types';

interface HtmlExportOptions {
  includeMetadata?: boolean;
  customBranding?: {
    logoUrl?: string;
    primaryColor?: string;
  };
}

export class HtmlExporter {
  private options: HtmlExportOptions;

  constructor(options: HtmlExportOptions = {}) {
    this.options = options;
  }

  generate(report: KnowledgeReport, videoTitle: string, videoPlatform: string): string {
    const primaryColor = this.options.customBranding?.primaryColor || '#6366f1';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${videoTitle} - Knowledge Report</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: ${primaryColor}; margin-bottom: 10px; }
    h2 { color: #1a1a1a; margin: 30px 0 15px; padding-bottom: 8px; border-bottom: 2px solid ${primaryColor}; }
    h3 { color: #1a1a1a; margin-bottom: 8px; }
    .meta { color: #666; margin-bottom: 25px; font-size: 14px; }
    .section { margin-bottom: 30px; padding: 20px; background: #f9fafb; border-radius: 8px; }
    .concept { margin-bottom: 15px; padding: 15px; background: white; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .concept-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .importance { font-size: 12px; padding: 2px 8px; border-radius: 12px; }
    .importance-high { background: #fee2e2; color: #dc2626; }
    .importance-medium { background: #fef3c7; color: #d97706; }
    .importance-low { background: #d1fae5; color: #059669; }
    .step { display: flex; gap: 15px; margin-bottom: 20px; }
    .step-number { width: 32px; height: 32px; background: ${primaryColor}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-weight: bold; }
    .step-content { flex: 1; }
    .step-title { font-weight: 600; margin-bottom: 5px; }
    .step-outcome { background: #d1fae5; padding: 10px; border-radius: 4px; margin-top: 8px; font-size: 14px; }
    .tool { margin-bottom: 12px; padding: 15px; background: white; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .tool-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
    .required { background: #fee2e2; color: #dc2626; font-size: 11px; padding: 2px 6px; border-radius: 4px; }
    .tool-link { color: ${primaryColor}; text-decoration: none; font-size: 14px; }
    .tool-link:hover { text-decoration: underline; }
    .prereq-list, .objective-list { list-style: disc; margin-left: 20px; }
    .prereq-list li, .objective-list li { margin-bottom: 8px; }
    .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 0 6px 6px 0; }
    .warning h3 { color: #92400e; margin-bottom: 8px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #666; font-size: 14px; text-align: center; }
  </style>
</head>
<body>
  <h1>${videoTitle}</h1>
  <p class="meta">
    Platform: ${videoPlatform.charAt(0).toUpperCase() + videoPlatform.slice(1)} | 
    Difficulty: ${report.difficulty_level.charAt(0).toUpperCase() + report.difficulty_level.slice(1)} | 
    Estimated Time: ${report.estimated_time_hours || 'N/A'} hours
  </p>

  <div class="section">
    <h2>Summary</h2>
    <p>${report.summary}</p>
  </div>

  <div class="section">
    <h2>Key Concepts</h2>
    ${report.key_concepts.map(c => `
      <div class="concept">
        <div class="concept-title">
          <h3>${c.title}</h3>
          <span class="importance importance-${c.importance}">${c.importance}</span>
        </div>
        <p>${c.description}</p>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2>Implementation Steps</h2>
    ${report.implementation_steps.map(s => `
      <div class="step">
        <div class="step-number">${s.step}</div>
        <div class="step-content">
          <div class="step-title">${s.title}</div>
          <p>${s.description}</p>
          ${s.expected_outcome ? `<div class="step-outcome"><strong>Expected Outcome:</strong> ${s.expected_outcome}</div>` : ''}
        </div>
      </div>
    `).join('')}
  </div>

  <div class="section">
    <h2>Required Tools</h2>
    ${report.tools_list.map(t => `
      <div class="tool">
        <div class="tool-header">
          <strong>${t.name}</strong>
          ${t.required ? '<span class="required">Required</span>' : ''}
        </div>
        <p>${t.description}</p>
        ${t.url ? `<a href="${t.url}" class="tool-link" target="_blank">Learn more →</a>` : ''}
      </div>
    `).join('')}
  </div>

  ${report.prerequisites && report.prerequisites.length > 0 ? `
  <div class="section">
    <h2>Prerequisites</h2>
    <ul class="prereq-list">
      ${report.prerequisites.map(p => `<li>${p}</li>`).join('')}
    </ul>
  </div>
  ` : ''}

  ${report.learning_objectives && report.learning_objectives.length > 0 ? `
  <div class="section">
    <h2>Learning Objectives</h2>
    <ul class="objective-list">
      ${report.learning_objectives.map(o => `<li>${o}</li>`).join('')}
    </ul>
  </div>
  ` : ''}

  ${report.warnings && report.warnings.length > 0 ? `
  <div class="warning">
    <h3>Warnings</h3>
    <ul>
      ${report.warnings.map(w => `<li>${w}</li>`).join('')}
    </ul>
  </div>
  ` : ''}

  ${this.options.includeMetadata ? `
  <div class="footer">
    <p>Generated by VidKnow on ${new Date().toLocaleDateString()}</p>
  </div>
  ` : ''}
</body>
</html>
    `.trim();
  }
}