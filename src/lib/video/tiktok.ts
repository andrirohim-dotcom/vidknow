import type { VideoAdapter, VideoMetadata, VideoTranscript } from './types';

export class TikTokAdapter implements VideoAdapter {
  platform = 'tiktok' as const;

  canHandle(url: string): boolean {
    const patterns = [
      /tiktok\.com\/@[\w.-]+\/video\/(\d+)/,
      /tiktok\.com\/t\/(\w+)/,
      /vm\.tiktok\.com\/(\w+)/,
    ];
    return patterns.some((pattern) => pattern.test(url));
  }

  extractVideoId(url: string): string | null {
    const patterns = [
      /tiktok\.com\/@[\w.-]+\/video\/(\d+)/,
      /tiktok\.com\/t\/(\w+)/,
      /vm\.tiktok\.com\/(\w+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match?.[1]) return match[1];
    }
    return null;
  }

  async getMetadata(videoId: string): Promise<VideoMetadata> {
    // In production, use TikTok API or scraping
    // For now, return mock data for development
    return {
      title: `TikTok Video ${videoId}`,
      description: 'Video description from TikTok',
      thumbnailUrl: `https://p16-sign-sg.tiktokcdn.com/obj/${videoId}`,
      durationSeconds: 60,
      channelName: '@username',
      channelUrl: 'https://tiktok.com/@username',
      publishedAt: new Date(),
    };
  }

  async getTranscript(videoId: string): Promise<VideoTranscript> {
    // TikTok doesn't have native transcript support
    // Would need AI-based audio transcription
    return {
      language: 'en',
      segments: [
        { start: 0, duration: 5, text: 'Video transcript from TikTok' },
      ],
      fullText: 'Video transcript from TikTok...',
    };
  }
}