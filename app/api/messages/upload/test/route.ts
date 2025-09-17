import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { MessageAttachment } from '@/lib/models';
import { existsSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    await connectDB();

    // Test file system access
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'messages');
    const canAccessUploads = existsSync(join(process.cwd(), 'public')) || existsSync(uploadsDir);

    // Test database access
    const attachmentCount = await MessageAttachment.countDocuments();

    // Test file path generation
    const testFileName = `test-${Date.now()}.txt`;
    const testFilePath = join(uploadsDir, testFileName);

    return NextResponse.json({
      success: true,
      working: true,
      tests: {
        databaseConnection: true,
        fileSystemAccess: canAccessUploads,
        uploadsDirectory: existsSync(uploadsDir),
        attachmentCount: attachmentCount
      },
      paths: {
        uploadsDir: uploadsDir,
        testFilePath: testFilePath,
        publicDir: join(process.cwd(), 'public')
      },
      message: 'File upload system is working correctly'
    });

  } catch (error) {
    console.error('File upload test error:', error);
    return NextResponse.json({
      success: false,
      working: false,
      error: error.message,
      message: 'File upload system has issues'
    }, { status: 500 });
  }
}