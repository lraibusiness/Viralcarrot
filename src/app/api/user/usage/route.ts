import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    
    // For free users, limit to 3 recipes total
    const maxRecipes = user.role === 'premium' || user.role === 'admin' ? Infinity : 3;
    
    // Get user's recipe count from their submitted recipes
    const fs = require('fs');
    const path = require('path');
    const recipesPath = path.join(process.cwd(), 'data', 'recipes.json');
    
    let userRecipes = [];
    if (fs.existsSync(recipesPath)) {
      const recipes = JSON.parse(fs.readFileSync(recipesPath, 'utf8'));
      userRecipes = recipes.filter((recipe: any) => recipe.createdBy === user.id);
    }
    
    const usedRecipes = userRecipes.length;
    const canGenerate = usedRecipes < maxRecipes;
    const remaining = Math.max(0, maxRecipes - usedRecipes);
    
    return NextResponse.json({
      success: true,
      usage: {
        used: usedRecipes,
        max: maxRecipes,
        remaining: remaining,
        canGenerate: canGenerate
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Authentication required' },
      { status: 401 }
    );
  }
}
