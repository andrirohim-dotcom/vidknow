'use client';

interface RelevanceScoreProps {
  score: number;
}

export function RelevanceScore({ score }: RelevanceScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Highly Relevant';
    if (score >= 5) return 'Moderately Relevant';
    return 'Low Relevance';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-semibold mb-2">Relevance to Your Goals</h3>
      <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
        {score}/10
      </div>
      <p className="text-gray-600 text-sm mt-2">
        {getScoreLabel(score)}
      </p>
    </div>
  );
}