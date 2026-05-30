'use client';

interface FeasibilityAssessmentProps {
  score: number;
  estimatedTimeHours?: number;
  prerequisites?: string[];
}

export function FeasibilityAssessment({
  score,
  estimatedTimeHours,
  prerequisites,
}: FeasibilityAssessmentProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Easy to Implement';
    if (score >= 5) return 'Moderate Effort';
    return 'Challenging';
  };

  const formatTime = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)} minutes`;
    if (hours === 1) return '1 hour';
    if (hours < 24) return `${Math.round(hours)} hours`;
    const days = Math.round(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-semibold mb-2">Implementation Feasibility</h3>
      <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
        {score}/10
      </div>
      <p className="text-gray-600 text-sm mt-2">
        {getScoreLabel(score)}
      </p>

      {estimatedTimeHours && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Estimated Time:</span>{' '}
            {formatTime(estimatedTimeHours)}
          </p>
        </div>
      )}

      {prerequisites && prerequisites.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-600 mb-2">Prerequisites:</p>
          <ul className="text-sm text-gray-600 list-disc list-inside">
            {prerequisites.map((prereq, index) => (
              <li key={index}>{prereq}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}