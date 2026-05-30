import type { VideoAdapter, VideoMetadata, VideoTranscript } from './types';

export class XComAdapter implements VideoAdapter {
  platform = 'xcom' as const;

  canHandle(url: string): boolean {
    const patterns = [
      /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/,
      /(?:twitter\.com|x\.com)\/\w+\/video\/(\d+)/,
    ];
    return patterns.some((pattern) => pattern.test(url));
  }

  extractVideoId(url: string): string | null {
    const patterns = [
      /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/,
      /(?:twitter\.com|x\.com)\/\w+\/video\/(\d+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match?.[1]) return match[1];
    }
    return null;
  }

  async getMetadata(videoId: string): Promise<VideoMetadata> {
    // In production, use Twitter API v2 or scraping
    // For now, return mock data for development
    return {
      title: `X.com Video ${videoId}`,
      description: 'Video description from X.com',
      thumbnailUrl: `https://pbs.twimg.com/ext_tw_video_thumb/${videoId}`,
      durationSeconds: 180,
      channelName: '@username',
      channelUrl: 'https://x.com/username',
      publishedAt: new Date(),
    };
  }

  async getTranscript(videoId: string): Promise<VideoTranscript> {
    // X.com doesn't have native transcript support
    // Would need AI-based audio transcription
    return {
      language: 'en',
      segments: [
        { start: 0, duration: 5, text: 'Video transcript from X.com' },
      ],
      fullText: 'Video transcript from X.com...',
    };
  }
}