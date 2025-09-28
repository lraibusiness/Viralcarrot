import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { AuthService } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Upload API: Starting image upload');
    
    // Check authentication
    const session = await AuthService.verifySession(request);
    if (!session) {
      console.log('❌ Upload API: Unauthorized - no session');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ Upload API: User authenticated:', session.user.email);

    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    console.log('📁 Upload API: File received:', file ? {
      name: file.name,
      size: file.size,
      type: file.type
    } : 'No file');
    
    if (!file) {
      console.log('❌ Upload API: No file provided');
      return NextResponse.json({ success: false, error: 'No image file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('❌ Upload API: Invalid file type:', file.type);
      return NextResponse.json({ success: false, error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log('❌ Upload API: File too large:', file.size);
      return NextResponse.json({ success: false, error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    console.log('📁 Upload API: Upload directory:', uploadsDir);
    
    try {
      await mkdir(uploadsDir, { recursive: true });
      console.log('✅ Upload API: Directory created/verified');
    } catch (error) {
      console.log('⚠️ Upload API: Directory creation error (might already exist):', error);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${timestamp}-${randomString}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    console.log('📝 Upload API: Saving file as:', fileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    console.log('✅ Upload API: File saved successfully');

    // Return the public URL
    const imageUrl = `/uploads/${fileName}`;

    console.log('�� Upload API: Returning URL:', imageUrl);

    return NextResponse.json({
      success: true,
      imageUrl,
      fileName
    });

  } catch (error) {
    console.error('❌ Upload API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to upload image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
