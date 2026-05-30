import type { PlatformType } from '@/types';
import type { VideoAdapter } from './types';
import { YouTubeAdapter } from './youtube';
import { XComAdapter } from './xcom';
import { TikTokAdapter } from './tiktok';

export class VideoParser {
  private adapters: VideoAdapter[];

  constructor() {
    this.adapters = [
      new YouTubeAdapter(),
      new XComAdapter(),
      new TikTokAdapter(),
    ];
  }

  detectPlatform(url: string): PlatformType | null {
    for (const adapter of this.adapters) {
      if (adapter.canHandle(url)) {
        return adapter.platform;
      }
    }
    return null;
  }

  getAdapter(url: string): VideoAdapter | null {
    for (const adapter of this.adapters) {
      if (adapter.canHandle(url)) {
        return adapter;
      }
    }
    return null;
  }

  extractVideoId(url: string): string | null {
    const adapter = this.getAdapter(url);
    return adapter?.extractVideoId(url) ?? null;
  }

  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return this.detectPlatform(url) !== null;
    } catch {
      return false;
    }
  }

  normalizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // Remove tracking parameters
      const paramsToRemove = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
      paramsToRemove.forEach((param) => urlObj.searchParams.delete(param));
      return urlObj.toString();
    } catch {
      return url;
    }
  }
}

export const videoParser = new VideoParser();