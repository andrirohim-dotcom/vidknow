import type { PlatformType } from '@/types';

export interface VideoMetadata {
  title: string;
  description: string;
  thumbnailUrl: string;
  durationSeconds: number;
  channelName: string;
  channelUrl: string;
  publishedAt: Date;
}

export interface TranscriptSegment {
  start: number;
  duration: number;
  text: string;
}

export interface VideoTranscript {
  language: string;
  segments: TranscriptSegment[];
  fullText: string;
}

export interface VideoAdapter {
  platform: PlatformType;
  canHandle(url: string): boolean;
  extractVideoId(url: string): string | null;
  getMetadata(videoId: string): Promise<VideoMetadata>;
  getTranscript(videoId: string): Promise<VideoTranscript>;
}

export interface VideoAdapterConfig {
  apiKey?: string;
  timeout?: number;
  retries?: number;
}