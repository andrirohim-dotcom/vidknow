import type { VideoAdapter, VideoMetadata, VideoTranscript } from './types';

export class YouTubeAdapter implements VideoAdapter {
  platform = 'youtube' as const;
  private apiKey?: string;

  constructor(config?: { apiKey?: string }) {
    this.apiKey = config?.apiKey;
  }

  canHandle(url: string): boolean {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
      /youtube\.com\/shorts\/([^?/]+)/,
    ];
    return patterns.some((pattern) => pattern.test(url));
  }

  extractVideoId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
      /youtube\.com\/shorts\/([^?/]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match?.[1]) return match[1];
    }
    return null;
  }

  async getMetadata(videoId: string): Promise<VideoMetadata> {
    // In production, use YouTube Data API v3
    // For now, return mock data for development
    return {
      title: `YouTube Video ${videoId}`,
      description: 'Video description from YouTube',
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      durationSeconds: 600,
      channelName: 'Channel Name',
      channelUrl: 'https://youtube.com/@channel',
      publishedAt: new Date(),
    };
  }

  async getTranscript(videoId: string): Promise<VideoTranscript> {
    // In production, use youtube-transcript package
    // For now, return mock data for development
    return {
      language: 'en',
      segments: [
        { start: 0, duration: 5, text: 'Welcome to this video' },
        { start: 5, duration: 5, text: 'Today we will learn about' },
      ],
      fullText: 'Welcome to this video. Today we will learn about...',
    };
  }
}