/**
 * Image helper utility to guarantee robust image resolution across
 * development, preview, and shared production environments on PC and mobile.
 */

export const STATIC_HERO_IMAGE = '/images/hero/farhan-hero.png';
export const DEFAULT_HERO_PORTRAIT = '/images/hero/farhan-hero.png';

export const FALLBACK_HERO_PORTRAITS = [
  '/images/hero/farhan-hero.png',
  '/images/hero/farhan-hero.jpg',
  '/farhan_hero_portrait.jpg',
  '/images/farhan_hero_portrait_1789381757896.jpg',
  '/src/assets/images/farhan_hero_portrait_1789381757896.jpg',
  '/uploads/farhan_hero_portrait.jpg'
];

/**
 * Normalizes any image URL to ensure it resolves reliably in all environments.
 * Converts internal /src/assets paths to public static asset paths.
 * Prevents device-local, temporary, or blob URLs from breaking cross-device display.
 */
export function getOptimizedImageUrl(rawUrl?: string | null): string {
  if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.trim() === '') {
    return DEFAULT_HERO_PORTRAIT;
  }

  const trimmed = rawUrl.trim();

  // Reject ephemeral device-local URLs, blob URLs, object URLs, file URLs, or large state data URLs
  if (
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('file:') ||
    trimmed.startsWith('content:') ||
    trimmed.startsWith('filesystem:') ||
    (trimmed.startsWith('data:') && !trimmed.startsWith('data:image/svg+xml'))
  ) {
    return DEFAULT_HERO_PORTRAIT;
  }

  // Permanent hero image
  if (trimmed === '/images/hero/farhan-hero.png' || trimmed === '/images/hero/farhan-hero.jpg') {
    return trimmed;
  }

  // Full external URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Uploaded files must be preserved with root-relative path
  if (trimmed.startsWith('/uploads/') || trimmed.startsWith('uploads/')) {
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  }

  // Static images must be preserved with root-relative path
  if (trimmed.startsWith('/images/') || trimmed.startsWith('images/')) {
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  }

  // Map legacy /src/assets/images paths to /images
  if (trimmed.startsWith('/src/assets/images/')) {
    return trimmed.replace('/src/assets/images/', '/images/');
  }

  // Ensure leading slash
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}
