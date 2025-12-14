import { v2 as cloudinary } from 'cloudinary'

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
})

// Upload options interface
export interface UploadOptions {
  folder?: string
  public_id?: string
  transformation?: any
  tags?: string[]
  context?: Record<string, string>
  resource_type?: 'image' | 'video' | 'raw'
  format?: string
  quality?: number
  width?: number
  height?: number
  crop?: string
}

// Upload result interface
export interface UploadResult {
  success: boolean
  public_id: string
  url: string
  secure_url: string
  width: number
  height: number
  format: string
  bytes: number
  resource_type: string
  created_at: string
  tags: string[]
  context?: Record<string, string>
  error?: string
}

// Cloudinary service class
export class CloudinaryService {
  // Upload file from buffer
  static async uploadBuffer(
    buffer: Buffer,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    try {
      const uploadOptions = {
        folder: options.folder || 'weddinglk',
        public_id: options.public_id,
        transformation: options.transformation,
        tags: options.tags || [],
        context: options.context,
        resource_type: options.resource_type || 'image',
        format: options.format,
        quality: options.quality || 'auto',
        width: options.width,
        height: options.height,
        crop: options.crop || 'fill',
      }

      const result = await new Promise<UploadResult>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              reject(error)
            } else if (result) {
              resolve({
                success: true,
                public_id: result.public_id,
                url: result.url,
                secure_url: result.secure_url,
                width: result.width,
                height: result.height,
                format: result.format,
                bytes: result.bytes,
                resource_type: result.resource_type,
                created_at: result.created_at,
                tags: result.tags || [],
                context: result.context as Record<string, string> || {},
              })
            } else {
              reject(new Error('Upload failed'))
            }
          }
        ).end(buffer)
      })

      return result
    } catch (error) {
      return {
        success: false,
        public_id: '',
        url: '',
        secure_url: '',
        width: 0,
        height: 0,
        format: '',
        bytes: 0,
        resource_type: 'image',
        created_at: new Date().toISOString(),
        tags: [],
        error: error instanceof Error ? error.message : 'Upload failed'
      }
    }
  }

  // Upload file from URL
  static async uploadUrl(
    url: string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    try {
      const uploadOptions = {
        folder: options.folder || 'weddinglk',
        public_id: options.public_id,
        transformation: options.transformation,
        tags: options.tags || [],
        context: options.context,
        resource_type: options.resource_type || 'image',
        format: options.format,
        quality: options.quality || 'auto',
        width: options.width,
        height: options.height,
        crop: options.crop || 'fill',
      }

      const result = await cloudinary.uploader.upload(url, uploadOptions)

      return {
        success: true,
        public_id: result.public_id,
        url: result.url,
        secure_url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        resource_type: result.resource_type,
        created_at: result.created_at,
        tags: result.tags || [],
        context: result.context as Record<string, string> || {},
      }
    } catch (error) {
      return {
        success: false,
        public_id: '',
        url: '',
        secure_url: '',
        width: 0,
        height: 0,
        format: '',
        bytes: 0,
        resource_type: 'image',
        created_at: new Date().toISOString(),
        tags: [],
        error: error instanceof Error ? error.message : 'Upload failed'
      }
    }
  }

  // Delete file
  static async deleteFile(publicId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await cloudinary.uploader.destroy(publicId)
      return { success: result.result === 'ok' }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Delete failed'
      }
    }
  }

  // Generate image URL with transformations
  static generateUrl(
    publicId: string,
    options: {
      width?: number
      height?: number
      crop?: string
      quality?: number | string
      format?: string
      effect?: string
    } = {}
  ): string {
    const transformation = {
      width: options.width,
      height: options.height,
      crop: options.crop || 'fill',
      quality: options.quality || 'auto',
      format: options.format,
      effect: options.effect,
    }

    return cloudinary.url(publicId, {
      transformation: [transformation],
      secure: true,
    })
  }

  // Generate thumbnail URL
  static generateThumbnailUrl(publicId: string, width: number = 300, height: number = 200): string {
    return this.generateUrl(publicId, {
      width,
      height,
      crop: 'fill',
      quality: 'auto',
    })
  }

  // Generate optimized URL for web
  static generateOptimizedUrl(publicId: string, width?: number, height?: number): string {
    return this.generateUrl(publicId, {
      width,
      height,
      crop: 'fill',
      quality: 'auto',
      format: 'auto',
    })
  }

  // Get file information
  static async getFileInfo(publicId: string): Promise<{
    success: boolean
    info?: any
    error?: string
  }> {
    try {
      const result = await cloudinary.api.resource(publicId)
      return { success: true, info: result }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get file info'
      }
    }
  }

  // Search files
  static async searchFiles(options: {
    folder?: string
    tags?: string[]
    max_results?: number
    next_cursor?: string
  } = {}): Promise<{
    success: boolean
    resources?: any[]
    next_cursor?: string
    error?: string
  }> {
    try {
      const searchOptions = {
        folder: options.folder || 'weddinglk',
        tags: options.tags,
        max_results: options.max_results || 20,
        next_cursor: options.next_cursor,
      }

      const result = await cloudinary.api.resources(searchOptions)
      return {
        success: true,
        resources: result.resources,
        next_cursor: result.next_cursor,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Search failed'
      }
    }
  }

  // Create folder
  static async createFolder(folderName: string): Promise<{ success: boolean; error?: string }> {
    // Cloudinary doesn't have a direct API to create folders
    // Folders are created automatically when files are uploaded
    return { success: true }
  }

  // Get folder contents
  static async getFolderContents(folderName: string): Promise<{
    success: boolean
    resources?: any[]
    error?: string
  }> {
    try {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: folderName,
        max_results: 100,
      })

      return {
        success: true,
        resources: result.resources,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get folder contents'
      }
    }
  }

  // Generate upload signature for client-side uploads
  static generateUploadSignature(params: {
    timestamp: number
    folder?: string
    public_id?: string
    tags?: string[]
  }): string {
    const signatureParams = {
      timestamp: params.timestamp,
      folder: params.folder || 'weddinglk',
      ...(params.public_id && { public_id: params.public_id }),
      ...(params.tags && { tags: params.tags.join(',') }),
    }

    return cloudinary.utils.api_sign_request(
      signatureParams,
      process.env.CLOUDINARY_API_SECRET || ''
    )
  }
}

// Export cloudinary instance for direct access
export { cloudinary } 