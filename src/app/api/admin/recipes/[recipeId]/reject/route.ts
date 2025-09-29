import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ recipeId: string }> }
) {
  try {
    const user = await requireAdmin(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { recipeId } = await params;
    // For now, we'll just not approve it
    // In a real app, you might want to add a 'rejected' status

    return NextResponse.json({
      success: true,
      message: 'Recipe rejected'
    });

  } catch (error) {
    console.error('Recipe rejection error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reject recipe' },
      { status: 500 }
    );
  }
}
