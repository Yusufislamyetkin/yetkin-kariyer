import sharp from "sharp";

const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const THUMBNAIL_WIDTH = 320;
const THUMBNAIL_HEIGHT = 320;
const QUALITY = 85;

export interface OptimizedImage {
  buffer: Buffer;
  width: number;
  height: number;
  format: "webp" | "jpeg";
  size: number;
}

export interface ThumbnailImage {
  buffer: Buffer;
  width: number;
  height: number;
  format: "webp" | "jpeg";
  size: number;
}

/**
 * Optimize image to max 1080p resolution and convert to WebP
 */
export async function optimizeImage(
  inputBuffer: Buffer,
  format: "webp" | "jpeg" = "webp"
): Promise<OptimizedImage> {
  const image = sharp(inputBuffer);
  const metadata = await image.metadata();

  // Calculate new dimensions while maintaining aspect ratio
  let width = metadata.width || MAX_WIDTH;
  let height = metadata.height || MAX_HEIGHT;

  if (width > MAX_WIDTH || height > MAX_HEIGHT) {
    const aspectRatio = width / height;
    if (width > height) {
      width = MAX_WIDTH;
      height = Math.round(MAX_WIDTH / aspectRatio);
    } else {
      height = MAX_HEIGHT;
      width = Math.round(MAX_HEIGHT * aspectRatio);
    }
  }

  // Resize and optimize
  // Use rotate() to automatically handle EXIF orientation from mobile devices
  let optimized = image.rotate().resize(width, height, {
    fit: "inside",
    withoutEnlargement: true,
  });

  // Convert to format
  if (format === "webp") {
    optimized = optimized.webp({ quality: QUALITY });
  } else {
    optimized = optimized.jpeg({ quality: QUALITY, mozjpeg: true });
  }

  const buffer = await optimized.toBuffer();

  return {
    buffer,
    width,
    height,
    format,
    size: buffer.length,
  };
}

/**
 * Create thumbnail version of image
 */
export async function createThumbnail(
  inputBuffer: Buffer,
  format: "webp" | "jpeg" = "webp"
): Promise<ThumbnailImage> {
  const image = sharp(inputBuffer);

  // Resize to thumbnail size
  // Use rotate() to automatically handle EXIF orientation from mobile devices
  let thumbnail = image.rotate().resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, {
    fit: "cover",
    position: "center",
  });

  // Convert to format
  if (format === "webp") {
    thumbnail = thumbnail.webp({ quality: 75 });
  } else {
    thumbnail = thumbnail.jpeg({ quality: 75, mozjpeg: true });
  }

  const buffer = await thumbnail.toBuffer();

  return {
    buffer,
    width: THUMBNAIL_WIDTH,
    height: THUMBNAIL_HEIGHT,
    format,
    size: buffer.length,
  };
}

/**
 * Get image metadata
 */
export async function getImageMetadata(buffer: Buffer) {
  const metadata = await sharp(buffer).metadata();
  return {
    width: metadata.width || 0,
    height: metadata.height || 0,
    format: metadata.format || "unknown",
    size: buffer.length,
  };
}

