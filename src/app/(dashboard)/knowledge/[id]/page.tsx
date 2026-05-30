'use client';

import { useEffect, useState } from 'react';
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

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

export default function ReportPage({ params }: ReportPageProps) {
  const [report, setReport] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { id } = await params;
        const response = await fetch(`/api/reports/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || 'Failed to fetch report');
        }

        setReport(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [params]);

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
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Report not found</div>
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
          <a
            href={`/knowledge/${report.extraction_id}`}
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
          >
            View in Library
          </a>
          <button
            onClick={() => window.print()}
            className="border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50"
          >
            Print Report
          </button>
        </div>
      </div>
    </div>
  );
}