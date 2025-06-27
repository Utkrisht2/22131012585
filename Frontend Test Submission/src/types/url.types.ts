// Add the 'export' keyword to make these types available for import.
export interface ClickData {
  timestamp: string;
  source: string;
  location: string;
}

export interface ShortenedUrl {
  id: string;
  longUrl: string;
  createdAt: string;
  expiresAt: string;
  clicks: ClickData[];
}