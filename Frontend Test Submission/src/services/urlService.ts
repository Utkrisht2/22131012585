import type { ShortenedUrl } from '../types/url.types';
import { nanoid } from 'nanoid';
import { Log } from '../lib/logging/logger';

const STORAGE_KEY = 'shortenedUrls';

const getUrlsFromStorage = (): ShortenedUrl[] => {
  try {
    const storedUrls = localStorage.getItem(STORAGE_KEY);
    if (storedUrls) return JSON.parse(storedUrls);
    Log('frontend', 'info', 'component', 'No URLs found in localStorage, returning empty array.');
    return [];
  } catch (error) {
    Log('frontend', 'error', 'component', `Failed to parse URLs from localStorage: ${error}`);
    return [];
  }
};

const saveUrlsToStorage = (urls: ShortenedUrl[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
    Log('frontend', 'debug', 'component', `Successfully saved ${urls.length} URLs to localStorage.`);
  } catch (error) {
    Log('frontend', 'error', 'component', `Failed to save URLs to localStorage: ${error}`);
  }
};

export const urlService = {
  getAllUrls: (): ShortenedUrl[] => getUrlsFromStorage(),

  getUrlByShortcode: (shortcode: string): ShortenedUrl | undefined => {
    const urls = getUrlsFromStorage();
    const foundUrl = urls.find(url => url.id === shortcode);
    if (!foundUrl) Log('frontend', 'warn', 'component', `URL with shortcode "${shortcode}" not found.`);
    return foundUrl;
  },

  isShortcodeTaken: (shortcode: string): boolean => {
    return getUrlsFromStorage().some(url => url.id === shortcode);
  },

  createShortUrl: (longUrl: string, validityMinutes: number = 30, customShortcode?: string): { success: boolean, data?: ShortenedUrl, error?: string } => {
    if (customShortcode) {
      if (!/^[a-zA-Z0-9]{4,10}$/.test(customShortcode)) {
        const msg = 'Custom shortcode must be 4-10 alphanumeric characters.';
        Log('frontend', 'warn', 'component', msg);
        return { success: false, error: msg };
      }
      if (urlService.isShortcodeTaken(customShortcode)) {
        const msg = `Shortcode "${customShortcode}" is already taken.`;
        Log('frontend', 'warn', 'component', msg);
        return { success: false, error: msg };
      }
    }

    const shortcode = customShortcode || nanoid(6);
    if (!customShortcode && urlService.isShortcodeTaken(shortcode)) {
        const msg = 'A collision occurred while generating a shortcode. Please try again.';
        Log('frontend', 'error', 'component', msg);
        return { success: false, error: msg };
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + validityMinutes * 60 * 1000);
    const newUrl: ShortenedUrl = {
      id: shortcode,
      longUrl,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      clicks: [],
    };

    const urls = getUrlsFromStorage();
    saveUrlsToStorage([...urls, newUrl]);
    Log('frontend', 'info', 'component', `Successfully created short URL for ${longUrl} with shortcode ${shortcode}`);
    return { success: true, data: newUrl };
  },

  recordClick: (shortcode: string): void => {
    const urls = getUrlsFromStorage();
    const urlIndex = urls.findIndex(url => url.id === shortcode);

    if (urlIndex !== -1) {
      const MOCK_LOCATIONS = ["New York, USA", "London, UK", "Tokyo, JP", "Sydney, AU", "Berlin, DE"];
      urls[urlIndex].clicks.push({
        timestamp: new Date().toISOString(),
        source: document.referrer || 'Direct',
        location: MOCK_LOCATIONS[Math.floor(Math.random() * MOCK_LOCATIONS.length)],
      });
      saveUrlsToStorage(urls);
      Log('frontend', 'info', 'component', `Click recorded for shortcode "${shortcode}".`);
    } else {
      Log('frontend', 'warn', 'component', `Attempted to record click for non-existent shortcode "${shortcode}".`);
    }
  },
};