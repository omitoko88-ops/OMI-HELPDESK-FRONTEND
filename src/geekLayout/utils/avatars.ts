/** Builds a cropped Unsplash avatar URL for a given photo id and pixel size. */
const unsplash = (photoId: string, size: number): string =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${size}&q=80`;

// Photo ids used by the original mock-up.
export const PHOTO_IDS = {
  neo: 'photo-1535713875002-d1d0cf377fde',
  alex: 'photo-1534528741775-53994a69daeb',
  devin: 'photo-1507003211169-0a1dd7228f2d',
} as const;

export const avatarUrl = (photo: keyof typeof PHOTO_IDS, size: number): string =>
  unsplash(PHOTO_IDS[photo], size);
