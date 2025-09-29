import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await AuthService.verifySession(request);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Read recipes from file
    const recipesPath = join(process.cwd(), 'data', 'recipes.json');
    let recipes = [];
    try {
      const data = await readFile(recipesPath, 'utf8');
      recipes = JSON.parse(data);
    } catch (error) {
      console.error('Error reading recipes:', error);
      return NextResponse.json({ success: false, error: 'Failed to read recipes' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      recipes: recipes
    });

  } catch (error) {
    console.error('Admin recipes API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recipes' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await AuthService.verifySession(request);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    const { id, ...recipeUpdates } = updates;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Recipe ID is required' }, { status: 400 });
    }

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
    const recipeIndex = recipes.findIndex((r: unknown) => r.id === id);
    if (recipeIndex === -1) {
      return NextResponse.json({ success: false, error: 'Recipe not found' }, { status: 404 });
    }

    // Update recipe
    recipes[recipeIndex] = {
      ...recipes[recipeIndex],
      ...recipeUpdates,
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

export async function DELETE(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await AuthService.verifySession(request);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get('id');

    if (!recipeId) {
      return NextResponse.json({ success: false, error: 'Recipe ID is required' }, { status: 400 });
    }

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

    // Find and remove recipe
    const recipeIndex = recipes.findIndex((r: unknown) => r.id === recipeId);
    if (recipeIndex === -1) {
      return NextResponse.json({ success: false, error: 'Recipe not found' }, { status: 404 });
    }

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
