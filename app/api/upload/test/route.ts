import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function GET() {
  try {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({
        success: false,
        error: 'Cloudinary not configured',
        configured: false,
        missing: {
          cloudName: !process.env.CLOUDINARY_CLOUD_NAME,
          apiKey: !process.env.CLOUDINARY_API_KEY,
          apiSecret: !process.env.CLOUDINARY_API_SECRET
        }
      }, { status: 500 });
    }

    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Test Cloudinary connection by getting account info
    const accountInfo = await cloudinary.api.ping();

    // Test search functionality
    const searchResult = await cloudinary.search
      .expression('folder:weddinglk')
      .max_results(1)
      .execute();

    return NextResponse.json({
      success: true,
      configured: true,
      cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY ? 'configured' : 'missing',
        apiSecret: process.env.CLOUDINARY_API_SECRET ? 'configured' : 'missing',
        ping: accountInfo.status === 'ok' ? 'success' : 'failed'
      },
      search: {
        totalResources: searchResult.total_count,
        resourcesFound: searchResult.resources.length
      },
      environment: {
        hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
        hasApiKey: !!process.env.CLOUDINARY_API_KEY,
        hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
      }
    });

  } catch (error) {
    console.error('Cloudinary test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      configured: false
    }, { status: 500 });
  }
}
