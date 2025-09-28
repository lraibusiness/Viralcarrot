import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Trending API: Fetching latest community recipes');
    
    // Fetch all approved user-submitted recipes
    const allRecipes = await AuthService.getAllRecipes();
    
    // Filter to only approved recipes and sort by creation date (newest first)
    const approvedRecipes = allRecipes
      .filter(recipe => recipe.isApproved)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 12); // Get latest 12 recipes
    
    // Transform to trending format
    const trendingRecipes = approvedRecipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      description: recipe.description,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      cookingTime: recipe.cookingTime,
      cuisine: recipe.cuisine || 'International',
      mealType: recipe.mealType || 'Dinner',
      dietaryStyle: recipe.dietaryStyle || 'Regular',
      views: Math.floor(Math.random() * 1000) + 100, // Mock views
      likes: Math.floor(Math.random() * 100) + 10, // Mock likes
      createdAt: recipe.createdAt,
      website: 'ViralCarrot Community',
      sourceUrl: recipe.sourceUrl
    }));
    
    console.log(`✅ Trending API: Found ${trendingRecipes.length} approved community recipes`);
    
    return NextResponse.json({
      success: true,
      recipes: trendingRecipes,
      total: trendingRecipes.length
    });
    
  } catch (error) {
    console.error('❌ Trending API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trending recipes' },
      { status: 500 }
    );
  }
}
