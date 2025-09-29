import { NextRequest, NextResponse } from 'next/server';
import { AuthService, requireAdmin } from '@/lib/auth';

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
    await AuthService.approveRecipe(recipeId);

    return NextResponse.json({
      success: true,
      message: 'Recipe approved successfully'
    });

  } catch (error) {
    console.error('Recipe approval error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to approve recipe' },
      { status: 500 }
    );
  }
}
