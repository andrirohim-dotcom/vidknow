'use client';

interface KnowledgeItem {
  id: string;
  status: string;
  created_at: string;
  video_source?: {
    title: string;
    platform: string;
    thumbnail_url: string;
  } | null;
  report?: {
    summary: string;
    difficulty_level: string;
    relevance_score: number;
  } | null;
}

interface KnowledgeCardProps {
  item: KnowledgeItem;
}

export function KnowledgeCard({ item }: KnowledgeCardProps) {
  const videoSource = item.video_source;
  const report = item.report;

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return '📺';
      case 'xcom':
        return '🐦';
      case 'tiktok':
        return '🎵';
      default:
        return '🎥';
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <a
      href={`/knowledge/${item.id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      {videoSource?.thumbnail_url && (
        <img
          src={videoSource.thumbnail_url}
          alt={videoSource.title || 'Video thumbnail'}
          className="w-full h-40 object-cover"
        />
      )}

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span>{getPlatformIcon(videoSource?.platform || '')}</span>
          <span className="text-sm text-gray-600 capitalize">
            {videoSource?.platform}
          </span>
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {videoSource?.title || 'Untitled Video'}
        </h3>

        {report?.summary && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {report.summary}
          </p>
        )}

        <div className="flex items-center justify-between">
          {report?.difficulty_level && (
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(
                report.difficulty_level
              )}`}
            >
              {report.difficulty_level.charAt(0).toUpperCase() +
                report.difficulty_level.slice(1)}
            </span>
          )}

          {report?.relevance_score && (
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-600">Relevance:</span>
              <span className="font-medium">{report.relevance_score}/10</span>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 mt-3">
          {new Date(item.created_at).toLocaleDateString()}
        </div>
      </div>
    </a>
  );
}