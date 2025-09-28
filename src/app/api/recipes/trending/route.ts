import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';

export async function GET() {
  try {
    const trendingRecipes = await AuthService.getTrendingRecipes();
    const newlyPostedRecipes = await AuthService.getNewlyPostedRecipes();

    return NextResponse.json({
      success: true,
      trending: trendingRecipes,
      newlyPosted: newlyPostedRecipes
    });

  } catch (error) {
    console.error('Trending recipes fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trending recipes' },
      { status: 500 }
    );
  }
}
