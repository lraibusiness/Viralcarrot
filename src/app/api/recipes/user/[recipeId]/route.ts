import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ recipeId: string }> }
) {
  try {
    // Check authentication
    const session = await AuthService.verifySession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { recipeId } = await params;
    const updates = await request.json();

    // Read current recipes
    const recipesPath = join(process.cwd(), 'data', 'recipes.json');
    let recipes = [];
    try {
      const data = await readFile(recipesPath, 'utf8');
      recipes = JSON.parse(data);
    } catch (error) {
      console.error('Error reading recipes:', error);
      return NextResponse.json({ success: false, error: 'Failed to read recipes' }, { status: 500 });
    }

    // Find and update recipe
    const recipeIndex = recipes.findIndex((r: any) => r.id === recipeId);
    if (recipeIndex === -1) {
      return NextResponse.json({ success: false, error: 'Recipe not found' }, { status: 404 });
    }

    // Check if user owns this recipe
    if (recipes[recipeIndex].createdBy !== session.user.email) {
      return NextResponse.json({ success: false, error: 'Not authorized to edit this recipe' }, { status: 403 });
    }

    // Update recipe
    recipes[recipeIndex] = {
      ...recipes[recipeIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Save updated recipes
    await writeFile(recipesPath, JSON.stringify(recipes, null, 2));

    return NextResponse.json({
      success: true,
      recipe: recipes[recipeIndex]
    });

  } catch (error) {
    console.error('Error updating recipe:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update recipe' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ recipeId: string }> }
) {
  try {
    // Check authentication
    const session = await AuthService.verifySession(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { recipeId } = await params;

    // Read current recipes
    const recipesPath = join(process.cwd(), 'data', 'recipes.json');
    let recipes = [];
    try {
      const data = await readFile(recipesPath, 'utf8');
      recipes = JSON.parse(data);
    } catch (error) {
      console.error('Error reading recipes:', error);
      return NextResponse.json({ success: false, error: 'Failed to read recipes' }, { status: 500 });
    }

    // Find recipe
    const recipeIndex = recipes.findIndex((r: any) => r.id === recipeId);
    if (recipeIndex === -1) {
      return NextResponse.json({ success: false, error: 'Recipe not found' }, { status: 404 });
    }

    // Check if user owns this recipe
    if (recipes[recipeIndex].createdBy !== session.user.email) {
      return NextResponse.json({ success: false, error: 'Not authorized to delete this recipe' }, { status: 403 });
    }

    // Remove recipe
    recipes.splice(recipeIndex, 1);

    // Save updated recipes
    await writeFile(recipesPath, JSON.stringify(recipes, null, 2));

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting recipe:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete recipe' },
      { status: 500 }
    );
  }
}
