'use client';

interface TimeEstimateProps {
  hours?: number;
}

export function TimeEstimate({ hours }: TimeEstimateProps) {
  const formatTime = (hours: number) => {
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    if (hours === 1) {
      return '1 hour';
    }
    if (hours < 24) {
      return `${Math.round(hours)} hours`;
    }
    const days = Math.round(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-semibold mb-2">Estimated Time</h3>
      <div className="text-2xl font-bold text-indigo-600">
        {hours ? formatTime(hours) : 'N/A'}
      </div>
      <p className="text-gray-600 text-sm mt-2">
        Time to implement after learning
      </p>
    </div>
  );
}