import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-utils';
import { connectDB } from "@/lib/db"
import { User } from "@/lib/models/user"

// Conditionally import and configure Cloudinary
let cloudinary: any = null;

async function initializeCloudinary() {
  if (process.env.CLOUDINARY_URL && process.env.CLOUDINARY_URL.startsWith('cloudinary://')) {
    try {
      const { v2 } = await import('cloudinary');
      cloudinary = v2;
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      console.log('✅ Cloudinary configured successfully');
    } catch (error) {
      console.log('⚠️ Cloudinary import failed:', error);
    }
  } else {
    console.log('⚠️ Cloudinary not configured - upload service disabled');
  }
}

// Initialize Cloudinary
initializeCloudinary();

// POST /api/upload - Handle file uploads
export async function POST(request: NextRequest) {
  try {
    // Check if Cloudinary is configured
    if (!cloudinary) {
      return NextResponse.json({ error: "Cloudinary not configured" }, { status: 503 })
    }
    
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const uploadType = formData.get('type') as string
    const entityId = formData.get('entityId') as string
    const folder = formData.get('folder') as string || 'weddinglk'

    if (!file || !uploadType || !entityId) {
      return NextResponse.json({
        error: 'File, type, and entityId are required'
      }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed'
      }, { status: 400 })
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({
        error: 'File size too large. Maximum size is 5MB'
      }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `${folder}/${uploadType}`,
          resource_type: 'auto',
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ],
          public_id: `${entityId}_${Date.now()}`,
          tags: [uploadType, entityId, user._id.toString()]
        },
        (error: any, result: any) => {
          if (error) reject(error)
          else resolve(result)
        }
      )

      uploadStream.end(buffer)
    }) as any

    // Create upload record in database (optional - you can create a separate model for this)
    const uploadData = {
      id: uploadResult.public_id,
      url: uploadResult.secure_url,
      thumbnail: uploadResult.secure_url.replace('/upload/', '/upload/c_thumb,w_300,h_200/'),
      filename: file.name,
      size: file.size,
      type: file.type,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
      uploadedAt: new Date(),
      entityId,
      uploadType,
      uploadedBy: user._id,
      cloudinaryId: uploadResult.public_id,
      cloudinaryUrl: uploadResult.secure_url
    }

    return NextResponse.json({
      success: true,
      data: uploadData,
      message: 'File uploaded successfully'
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Upload failed',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// GET /api/upload - Get upload gallery
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const entityId = searchParams.get('entityId')
    const type = searchParams.get('type')
    const folder = searchParams.get('folder') || 'weddinglk'

    if (!entityId || !type) {
      return NextResponse.json({
        error: 'EntityId and type are required'
      }, { status: 400 })
    }

    // Get images from Cloudinary
    try {
      const result = await cloudinary.search
        .expression(`folder:${folder}/${type} AND tags:${entityId}`)
        .sort_by('created_at', 'desc')
        .max_results(50)
        .execute()

      const images = result.resources.map((resource: any) => ({
        id: resource.public_id,
        url: resource.secure_url,
        thumbnail: resource.secure_url.replace('/upload/', '/upload/c_thumb,w_300,h_200/'),
        width: resource.width,
        height: resource.height,
        format: resource.format,
        size: resource.bytes,
        uploadedAt: resource.created_at,
        tags: resource.tags
      }))

      return NextResponse.json({
        success: true,
        data: images,
        total: images.length
      })

    } catch (cloudinaryError) {
      console.error('Cloudinary search error:', cloudinaryError)
      return NextResponse.json({
        success: true,
        data: [],
        total: 0,
        message: 'Unable to fetch images from cloud storage'
      })
    }

  } catch (error) {
    console.error('Gallery error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load gallery',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/upload - Delete uploaded file
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get('fileId')

    if (!fileId) {
      return NextResponse.json({
        error: 'File ID is required'
      }, { status: 400 })
    }

    // Delete from Cloudinary
    try {
      const result = await cloudinary.uploader.destroy(fileId)
      
      if (result.result === 'ok') {
        return NextResponse.json({
          success: true,
          message: 'File deleted successfully'
        })
      } else {
        return NextResponse.json({
          success: false,
          error: 'Failed to delete file from cloud storage'
        }, { status: 500 })
      }

    } catch (cloudinaryError) {
      console.error('Cloudinary delete error:', cloudinaryError)
      return NextResponse.json({
        success: false,
        error: 'Failed to delete file from cloud storage'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Delete failed',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// PUT /api/upload - Update file metadata
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { fileId, tags, context } = body

    if (!fileId) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 })
    }

    // Update file metadata in Cloudinary
    try {
      const updateData: any = {}
      if (tags) updateData.tags = tags
      if (context) updateData.context = context

      const result = await cloudinary.uploader.explicit(fileId, {
        type: 'upload',
        ...updateData
      })

      return NextResponse.json({
        success: true,
        data: result,
        message: 'File metadata updated successfully'
      })

    } catch (cloudinaryError) {
      console.error('Cloudinary update error:', cloudinaryError)
      return NextResponse.json({
        success: false,
        error: 'Failed to update file metadata'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Update failed',
        message: 'Internal server error'
      },
      { status: 500 }
    )
  }
} 