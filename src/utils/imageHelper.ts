/**
 * Image helper utility to guarantee robust image resolution across
 * development, preview, and shared production environments on PC and mobile.
 */

export const DEFAULT_HERO_PORTRAIT = '/farhan_hero_portrait.jpg';

export const FALLBACK_HERO_PORTRAITS = [
  '/farhan_hero_portrait.jpg',
  '/images/farhan_hero_portrait_1789381757896.jpg',
  '/src/assets/images/farhan_hero_portrait_1789381757896.jpg',
  '/uploads/farhan_hero_portrait.jpg'
];

/**
 * Normalizes any image URL to ensure it resolves reliably in all environments.
 * Converts internal /src/assets paths to public static asset paths.
 */
export function getOptimizedImageUrl(rawUrl?: string | null): string {
  if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.trim() === '') {
    return DEFAULT_HERO_PORTRAIT;
  }

  const trimmed = rawUrl.trim();

  // Full external URL or data URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // Any variation of Farhan's portrait image
  if (trimmed.includes('farhan_hero_portrait')) {
    return DEFAULT_HERO_PORTRAIT;
  }

  // Ensure leading slash
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}
