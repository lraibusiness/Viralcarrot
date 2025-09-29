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

    const recipes = await AuthService.getUserRecipes(user.id);

    return NextResponse.json({
      success: true,
      recipes
    });

  } catch (error) {
    console.error('User recipes fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user recipes' },
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

    const recipeData = await request.json();
    const recipe = await AuthService.addUserRecipe({ ...recipeData, createdBy: user.id });

    return NextResponse.json({
      success: true,
      recipe
    });

  } catch (error) {
    console.error('Recipe creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create recipe' },
      { status: 500 }
    );
  }
}
