import { NextRequest, NextResponse } from 'next/server';
import { AuthService, requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const usage = await AuthService.checkTotalUsage(user.id);
    
    return NextResponse.json({
      success: true,
      usage
    });

  } catch (error) {
    console.error('Usage check error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check usage' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user can generate recipes
    const usage = await AuthService.checkTotalUsage(user.id);
    if (!usage.canGenerate) {
      return NextResponse.json(
        { success: false, error: 'Daily limit reached' },
        { status: 429 }
      );
    }

    // Increment usage
    await AuthService.incrementTotalUsage(user.id);
    
    return NextResponse.json({
      success: true,
      message: 'Usage incremented'
    });

  } catch (error) {
    console.error('Usage increment error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to increment usage' },
      { status: 500 }
    );
  }
}
