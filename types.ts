
export type MediaType = 'image' | 'video';

export interface MediaItem {
  id: string;
  url: string;
  thumbnail?: string; // Optional thumbnail for videos
  type: MediaType;
  caption: string;
  guestName: string;
  timestamp: number;
}

export interface GeminiResponse {
  caption: string;
  sentiment: string;
}
