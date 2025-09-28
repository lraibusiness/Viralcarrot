import { NextRequest, NextResponse } from 'next/server';
import { AuthService, requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const recipes = await AuthService.getAllRecipes();

    return NextResponse.json({
      success: true,
      recipes
    });

  } catch (error) {
    console.error('Admin recipes fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { recipeId, action } = await request.json();
    
    if (action === 'approve') {
      await AuthService.approveRecipe(recipeId);
    } else if (action === 'reject') {
      // For now, we'll just not approve it
      // In a real app, you might want to add a 'rejected' status
    }

    return NextResponse.json({
      success: true,
      message: `Recipe ${action}d successfully`
    });

  } catch (error) {
    console.error('Admin recipe update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update recipe' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get('recipeId');
    
    if (!recipeId) {
      return NextResponse.json(
        { success: false, error: 'Recipe ID is required' },
        { status: 400 }
      );
    }

    await AuthService.deleteRecipe(recipeId);

    return NextResponse.json({
      success: true,
      message: 'Recipe deleted successfully'
    });

  } catch (error) {
    console.error('Admin recipe delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete recipe' },
      { status: 500 }
    );
  }
}
