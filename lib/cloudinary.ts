/**
 * Cloudinary Service
 * Handles image upload and management
 */

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dl2h9t0le',
  api_key: process.env.CLOUDINARY_API_KEY || '136527429911654',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'rLy6xSu_3pXaB0GFgHUH3oRCXM8',
  secure: true
});

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  bytes: number;
}

export interface CloudinaryUploadOptions {
  folder?: string;
  transformation?: any;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
  quality?: 'auto' | number;
  format?: 'auto' | string;
}

/**
 * Upload image to Cloudinary
 */
export async function uploadImage(
  file: Buffer | string,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult> {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: options.folder || 'weddinglk',
      resource_type: options.resource_type || 'image',
      quality: options.quality || 'auto',
      format: options.format || 'auto',
      transformation: options.transformation || {
        width: 1200,
        height: 800,
        crop: 'fill',
        gravity: 'auto'
      }
    });

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Delete image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
}

/**
 * Get image URL with transformations
 */
export function getImageUrl(publicId: string, transformations?: any): string {
  return cloudinary.url(publicId, {
    transformation: transformations || {
      width: 800,
      height: 600,
      crop: 'fill',
      quality: 'auto',
      format: 'auto'
    }
  });
}

/**
 * Test Cloudinary connection
 */
export async function testCloudinaryConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    // Test by listing resources
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 1
    });
    
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown Cloudinary error' 
    };
  }
}

export default cloudinary;
