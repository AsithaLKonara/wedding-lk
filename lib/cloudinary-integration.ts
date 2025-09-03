import { v2 as cloudinary } from 'cloudinary'

interface CloudinaryConfig {
  cloudName: string
  apiKey: string
  apiSecret: string
}

interface UploadOptions {
  folder?: string
  transformation?: any
  publicId?: string
  tags?: string[]
  context?: Record<string, string>
}

interface UploadResult {
  publicId: string
  url: string
  secureUrl: string
  width: number
  height: number
  format: string
  size: number
  tags: string[]
  context: Record<string, string>
}

interface GalleryItem {
  id: string
  url: string
  thumbnail: string
  title: string
  description?: string
  category: string
  tags: string[]
  uploadedAt: Date
}

export class CloudinaryIntegration {
  private config: CloudinaryConfig

  constructor() {
    this.config = {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
      apiKey: process.env.CLOUDINARY_API_KEY || '',
      apiSecret: process.env.CLOUDINARY_API_SECRET || ''
    }

    cloudinary.config({
      cloud_name: this.config.cloudName,
      api_key: this.config.apiKey,
      api_secret: this.config.apiSecret
    })
  }

  // Upload single image
  async uploadImage(
    file: File | Buffer | string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    try {
      const uploadOptions = {
        folder: options.folder || 'weddinglk',
        transformation: options.transformation || {
          quality: 'auto',
          fetch_format: 'auto'
        },
        public_id: options.publicId,
        tags: options.tags || [],
        context: options.context || {}
      }

      let uploadResult: any
      if (typeof file === 'string') {
        // Upload from URL
        uploadResult = await cloudinary.uploader.upload(file, uploadOptions)
      } else if (file instanceof Buffer) {
        // Upload from buffer
        uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }).end(file)
        })
      } else {
        // Upload from file (File object)
        const arrayBuffer = await (file as File).arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }).end(buffer)
        })
      }

      return {
        publicId: uploadResult.public_id,
        url: uploadResult.url,
        secureUrl: uploadResult.secure_url,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        size: uploadResult.bytes,
        tags: uploadResult.tags || [],
        context: uploadResult.context || {}
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      throw new Error('Failed to upload image')
    }
  }

  // Upload multiple images
  async uploadMultipleImages(
    files: (File | Buffer | string)[],
    options: UploadOptions = {}
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map((file, index) => 
      this.uploadImage(file, {
        ...options,
        publicId: options.publicId ? `${options.publicId}_${index}` : undefined
      })
    )

    return Promise.all(uploadPromises)
  }

  // Upload venue gallery images
  async uploadVenueGallery(
    venueId: string,
    images: File[],
    metadata: {
      venueName: string
      location: string
      category: string
    }
  ): Promise<GalleryItem[]> {
    const uploadPromises = images.map(async (image, index) => {
      const result = await this.uploadImage(image, {
        folder: `venues/${venueId}/gallery`,
        tags: ['venue', 'gallery', metadata.category, metadata.location],
        context: {
          venue_id: venueId,
          venue_name: metadata.venueName,
          location: metadata.location,
          category: metadata.category,
          image_index: index.toString()
        }
      })

      return {
        id: result.publicId,
        url: result.secureUrl,
        thumbnail: this.generateThumbnailUrl(result.publicId),
        title: `${metadata.venueName} - Image ${index + 1}`,
        description: `Gallery image for ${metadata.venueName} in ${metadata.location}`,
        category: 'venue',
        tags: result.tags,
        uploadedAt: new Date()
      }
    })

    return Promise.all(uploadPromises)
  }

  // Upload vendor portfolio images
  async uploadVendorPortfolio(
    vendorId: string,
    images: File[],
    metadata: {
      vendorName: string
      category: string
      location: string
    }
  ): Promise<GalleryItem[]> {
    const uploadPromises = images.map(async (image, index) => {
      const result = await this.uploadImage(image, {
        folder: `vendors/${vendorId}/portfolio`,
        tags: ['vendor', 'portfolio', metadata.category, metadata.location],
        context: {
          vendor_id: vendorId,
          vendor_name: metadata.vendorName,
          category: metadata.category,
          location: metadata.location,
          image_index: index.toString()
        }
      })

      return {
        id: result.publicId,
        url: result.secureUrl,
        thumbnail: this.generateThumbnailUrl(result.publicId),
        title: `${metadata.vendorName} - Portfolio ${index + 1}`,
        description: `Portfolio image for ${metadata.vendorName} (${metadata.category})`,
        category: 'vendor',
        tags: result.tags,
        uploadedAt: new Date()
      }
    })

    return Promise.all(uploadPromises)
  }

  // Upload wedding event photos
  async uploadEventPhotos(
    eventId: string,
    images: File[],
    metadata: {
      eventName: string
      date: string
      location: string
      photographer: string
    }
  ): Promise<GalleryItem[]> {
    const uploadPromises = images.map(async (image, index) => {
      const result = await this.uploadImage(image, {
        folder: `events/${eventId}/photos`,
        tags: ['event', 'wedding', 'photography', metadata.location],
        context: {
          event_id: eventId,
          event_name: metadata.eventName,
          event_date: metadata.date,
          location: metadata.location,
          photographer: metadata.photographer,
          image_index: index.toString()
        }
      })

      return {
        id: result.publicId,
        url: result.secureUrl,
        thumbnail: this.generateThumbnailUrl(result.publicId),
        title: `${metadata.eventName} - Photo ${index + 1}`,
        description: `Event photo by ${metadata.photographer}`,
        category: 'event',
        tags: result.tags,
        uploadedAt: new Date()
      }
    })

    return Promise.all(uploadPromises)
  }

  // Generate optimized image URLs
  generateOptimizedUrl(publicId: string, options: {
    width?: number
    height?: number
    quality?: string
    format?: string
    crop?: string
  } = {}): string {
    const transformation = {
      width: options.width,
      height: options.height,
      quality: options.quality || 'auto',
      fetch_format: options.format || 'auto',
      crop: options.crop || 'fill'
    }

    return cloudinary.url(publicId, {
      transformation: [transformation],
      secure: true
    })
  }

  // Generate thumbnail URL
  generateThumbnailUrl(publicId: string, size: number = 300): string {
    return this.generateOptimizedUrl(publicId, {
      width: size,
      height: size,
      crop: 'fill',
      quality: 'auto'
    })
  }

  // Generate responsive image URLs
  generateResponsiveUrls(publicId: string): {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  } {
    return {
      xs: this.generateOptimizedUrl(publicId, { width: 320 }),
      sm: this.generateOptimizedUrl(publicId, { width: 640 }),
      md: this.generateOptimizedUrl(publicId, { width: 768 }),
      lg: this.generateOptimizedUrl(publicId, { width: 1024 }),
      xl: this.generateOptimizedUrl(publicId, { width: 1280 })
    }
  }

  // Delete image
  async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result = await cloudinary.uploader.destroy(publicId)
      return result.result === 'ok'
    } catch (error) {
      console.error('Cloudinary delete error:', error)
      return false
    }
  }

  // Delete multiple images
  async deleteMultipleImages(publicIds: string[]): Promise<{
    success: string[]
    failed: string[]
  }> {
    const results = await Promise.allSettled(
      publicIds.map(id => this.deleteImage(id))
    )

    const success: string[] = []
    const failed: string[] = []

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        success.push(publicIds[index])
      } else {
        failed.push(publicIds[index])
      }
    })

    return { success, failed }
  }

  // Get image information
  async getImageInfo(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.api.resource(publicId)
      return result
    } catch (error) {
      console.error('Cloudinary get info error:', error)
      throw new Error('Failed to get image information')
    }
  }

  // Search images by tags
  async searchImagesByTags(tags: string[], options: {
    maxResults?: number
    folder?: string
  } = {}): Promise<GalleryItem[]> {
    try {
      const result = await cloudinary.search
        .expression(`tags:${tags.join(' AND ')}`)
        .sort_by('created_at', 'desc')
        .max_results(options.maxResults || 50)
        .execute()

      return result.resources.map((resource: any) => ({
        id: resource.public_id,
        url: resource.secure_url,
        thumbnail: this.generateThumbnailUrl(resource.public_id),
        title: resource.context?.title || resource.public_id,
        description: resource.context?.description,
        category: resource.context?.category || 'general',
        tags: resource.tags || [],
        uploadedAt: new Date(resource.created_at)
      }))
    } catch (error) {
      console.error('Cloudinary search error:', error)
      return []
    }
  }

  // Create image collage
  async createCollage(publicIds: string[], options: {
    width: number
    height: number
    columns: number
    rows: number
  }): Promise<string> {
    try {
      const transformation = {
        width: options.width,
        height: options.height,
        crop: 'fill',
        gravity: 'auto'
      }

      const collageUrl = cloudinary.url('sample', {
        transformation: [
          transformation,
          {
            overlay: publicIds[0],
            width: options.width / options.columns,
            height: options.height / options.rows,
            x: 0,
            y: 0
          }
        ],
        secure: true
      })

      return collageUrl
    } catch (error) {
      console.error('Collage creation error:', error)
      throw new Error('Failed to create collage')
    }
  }

  // Generate image transformations for different use cases
  getTransformationPresets(): Record<string, any> {
    return {
      venue_hero: {
        width: 1200,
        height: 600,
        crop: 'fill',
        gravity: 'auto',
        quality: 'auto'
      },
      venue_thumbnail: {
        width: 300,
        height: 200,
        crop: 'fill',
        gravity: 'auto',
        quality: 'auto'
      },
      vendor_portfolio: {
        width: 800,
        height: 600,
        crop: 'fill',
        gravity: 'auto',
        quality: 'auto'
      },
      event_gallery: {
        width: 1024,
        height: 768,
        crop: 'fill',
        gravity: 'auto',
        quality: 'auto'
      },
      profile_avatar: {
        width: 150,
        height: 150,
        crop: 'fill',
        gravity: 'face',
        quality: 'auto'
      }
    }
  }
}

export const cloudinaryIntegration = new CloudinaryIntegration() 