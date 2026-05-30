'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Summary } from '@/components/reports/summary';
import { KeyConcepts } from '@/components/reports/key-concepts';
import { ImplementationSteps } from '@/components/reports/implementation-steps';
import { ToolsList } from '@/components/reports/tools-list';
import { DifficultyIndicator } from '@/components/reports/difficulty-indicator';
import { TimeEstimate } from '@/components/reports/time-estimate';

interface ReportData {
  id: string;
  extraction_id: string;
  summary: string;
  key_concepts: Array<{ title: string; description: string; importance: 'high' | 'medium' | 'low' }>;
  implementation_steps: Array<{ step: number; title: string; description: string; expected_outcome: string }>;
  tools_list: Array<{ name: string; url?: string; description: string; required: boolean }>;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  estimated_time_hours?: number;
  relevance_score?: number;
  feasibility_score?: number;
  value_score?: number;
  prerequisites?: string[];
  learning_objectives?: string[];
  warnings?: string[];
  extraction?: {
    video_source?: {
      title: string;
      platform: string;
      url: string;
    };
  };
}

interface ExtractionData {
  id: string;
  status: string;
  progress_percent: number;
  video_source?: {
    title: string;
    platform: string;
  };
}

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

export default function ReportPage({ params }: ReportPageProps) {
  const supabase = createClient();
  const [report, setReport] = useState<ReportData | null>(null);
  const [extraction, setExtraction] = useState<ExtractionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { id } = await params;

        // First, try to get the report directly
        const { data: reportData, error: reportError } = await supabase
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
          .single();

        if (reportData) {
          setReport(reportData as unknown as ReportData);
          setIsLoading(false);
          return;
        }

        // If no report found, try to get extraction by ID
        const { data: extractionData, error: extractionError } = await supabase
          .from('knowledge_extractions')
          .select(`
            id,
            status,
            progress_percent,
            report:knowledge_reports(
              id
            ),
            video_source:video_sources(
              title,
              platform
            )
          `)
          .eq('id', id)
          .single();

        if (extractionData) {
          setExtraction(extractionData as unknown as ExtractionData);

          // If extraction is completed and has a report, fetch the report
          if (extractionData.status === 'completed' && extractionData.report?.[0]?.id) {
            const { data: fullReport } = await supabase
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
              .eq('id', extractionData.report[0].id)
              .single();

            if (fullReport) {
              setReport(fullReport as unknown as ReportData);
            }
          }
        } else {
          setError('Report not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params, supabase]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading report...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <a href="/knowledge" className="text-indigo-600 hover:text-indigo-800 mt-4 inline-block">
            ← Back to Library
          </a>
        </div>
      </div>
    );
  }

  // If extraction is still processing, show progress
  if (extraction && !report) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <a href="/knowledge" className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
            ← Back to Library
          </a>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-4">
              {extraction.video_source?.title || 'Knowledge Extraction'}
            </h1>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Status: {extraction.status}</span>
                <span>{extraction.progress_percent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    extraction.status === 'completed'
                      ? 'bg-green-600'
                      : extraction.status === 'failed'
                      ? 'bg-red-600'
                      : 'bg-indigo-600'
                  }`}
                  style={{ width: `${extraction.progress_percent}%` }}
                />
              </div>
            </div>

            {extraction.status === 'processing' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-700">
                  AI is still extracting knowledge. Please wait...
                </p>
              </div>
            )}

            {extraction.status === 'failed' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">Extraction failed. Please try again.</p>
                <a href="/extract" className="text-indigo-600 hover:text-indigo-800 mt-2 inline-block">
                  Try Again →
                </a>
              </div>
            )}

            {extraction.status === 'completed' && !report && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-700">
                  Extraction completed but report not found. The report may still be processing.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-indigo-600 hover:text-indigo-800 mt-2 inline-block"
                >
                  Refresh Page →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Report not found</p>
          <a href="/knowledge" className="text-indigo-600 hover:text-indigo-800">
            ← Back to Library
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <a href="/knowledge" className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
            ← Back to Knowledge Library
          </a>
          <h1 className="text-3xl font-bold">
            {report.extraction?.video_source?.title || 'Knowledge Report'}
          </h1>
          <p className="text-gray-600 mt-2">
            Extracted from {report.extraction?.video_source?.platform}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <DifficultyIndicator level={report.difficulty_level} />
          <TimeEstimate hours={report.estimated_time_hours} />
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-2">Relevance Score</h3>
            <div className="text-3xl font-bold text-indigo-600">
              {report.relevance_score || '-'}/10
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Summary summary={report.summary} />
          <KeyConcepts concepts={report.key_concepts} />
          <ImplementationSteps steps={report.implementation_steps} />
          <ToolsList tools={report.tools_list} />

          {report.prerequisites && report.prerequisites.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Prerequisites</h2>
              <ul className="list-disc list-inside space-y-2">
                {report.prerequisites.map((prereq, index) => (
                  <li key={index} className="text-gray-700">{prereq}</li>
                ))}
              </ul>
            </div>
          )}

          {report.learning_objectives && report.learning_objectives.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Learning Objectives</h2>
              <ul className="list-disc list-inside space-y-2">
                {report.learning_objectives.map((objective, index) => (
                  <li key={index} className="text-gray-700">{objective}</li>
                ))}
              </ul>
            </div>
          )}

          {report.warnings && report.warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-yellow-800">Warnings</h2>
              <ul className="list-disc list-inside space-y-2">
                {report.warnings.map((warning, index) => (
                  <li key={index} className="text-yellow-700">{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => window.print()}
            className="border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50"
          >
            Print Report
          </button>
          <a
            href="/extract"
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
          >
            Extract Another
          </a>
        </div>
      </div>
    </div>
  );
}