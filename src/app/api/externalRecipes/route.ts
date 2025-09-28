import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import NodeCache from 'node-cache';

// Initialize cache with 1 hour TTL for external recipes
const cache = new NodeCache({ stdTTL: 3600 });

interface ExternalRecipe {
  id: string;
  title: string;
  image: string;
  description: string;
  ingredients: string[];
  steps: string[];
  cookingTime: number;
  cuisine?: string;
  mealType?: string;
  dietaryStyle?: string;
  source: string;
  sourceUrl: string;
  rating?: number;
  difficulty?: string;
  servings?: number;
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  ingredientMatch?: {
    availableIngredients: string[];
    missingIngredients: string[];
    matchPercentage: number;
  };
}

interface RecipeFilters {
  cookingTime?: string;
  cuisine?: string;
  mealType?: string;
  dietaryStyle?: string;
}

// External recipe sources
const EXTERNAL_SOURCES = [
  {
    name: 'AllRecipes',
    baseUrl: 'https://www.allrecipes.com',
    searchUrl: 'https://www.allrecipes.com/search?q=',
    apiUrl: 'https://www.allrecipes.com/api/recipes'
  },
  {
    name: 'FoodNetwork',
    baseUrl: 'https://www.foodnetwork.com',
    searchUrl: 'https://www.foodnetwork.com/search?q=',
    apiUrl: 'https://www.foodnetwork.com/api/recipes'
  },
  {
    name: 'BBCGoodFood',
    baseUrl: 'https://www.bbcgoodfood.com',
    searchUrl: 'https://www.bbcgoodfood.com/search?q=',
    apiUrl: 'https://www.bbcgoodfood.com/api/recipes'
  }
];

export async function POST(request: NextRequest) {
  try {
    console.log('🌐 External Recipes API: Starting external recipe fetch');
    
    const body = await request.json();
    const { mainFood, ingredients = [], filters = {} } = body;

    console.log('📝 External API: Received request:', { mainFood, ingredients, filters });

    if (!mainFood || !mainFood.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please enter a main food item' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `external_recipes_${mainFood}_${JSON.stringify(ingredients)}_${JSON.stringify(filters)}`;
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      console.log('⚡ External API: Returning cached result');
      return NextResponse.json(cachedResult);
    }

    // Build search query
    const searchQuery = buildSearchQuery(mainFood, ingredients, filters as RecipeFilters);
    console.log('🔍 External Search Query:', searchQuery);

    // Fetch external recipes from multiple sources
    const externalRecipes = await fetchExternalRecipes(searchQuery, mainFood, ingredients);
    
    console.log(`📊 External API: Found ${externalRecipes.length} external recipes`);

    const result = {
      success: true,
      recipes: externalRecipes,
      total: externalRecipes.length,
      message: `Found ${externalRecipes.length} popular recipes from the web`,
      sources: [...new Set(externalRecipes.map(r => r.source))],
      searchMetadata: {
        mainFood,
        searchQuery,
        ingredientCount: ingredients.length,
        filtersApplied: Object.keys(filters).length,
        externalRecipesFound: externalRecipes.length
      }
    };

    // Cache the result
    cache.set(cacheKey, result);

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ External API: Error fetching external recipes:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch external recipes',
        details: process.env.NODE_ENV === 'development' ? (error as Error)?.toString() : 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// Build search query for external sources
function buildSearchQuery(mainFood: string, ingredients: string[], filters: RecipeFilters): string {
  let query = mainFood;
  
  // Add supporting ingredients
  if (ingredients && ingredients.length > 0) {
    query += ` ${ingredients.join(' ')}`;
  }
  
  // Add cuisine filter
  if (filters.cuisine) {
    query += ` ${filters.cuisine}`;
  }
  
  // Add meal type filter
  if (filters.mealType) {
    query += ` ${filters.mealType}`;
  }
  
  // Add dietary style filter
  if (filters.dietaryStyle) {
    query += ` ${filters.dietaryStyle}`;
  }
  
  return query.trim();
}

// Fetch external recipes from multiple sources
async function fetchExternalRecipes(searchQuery: string, mainFood: string, userIngredients: string[]): Promise<ExternalRecipe[]> {
  const allRecipes: ExternalRecipe[] = [];
  
  try {
    // Fetch from multiple sources in parallel
    const sourcePromises = EXTERNAL_SOURCES.map(source => 
      fetchFromSource(source, searchQuery, mainFood, userIngredients)
    );

    const results = await Promise.allSettled(sourcePromises);
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allRecipes.push(...result.value);
        console.log(`✅ External Source ${index + 1} completed: ${result.value.length} recipes`);
      } else {
        console.warn(`⚠️ External Source ${index + 1} failed:`, result.reason);
      }
    });

    // Sort by relevance and limit results
    const sortedRecipes = allRecipes
      .sort((a, b) => (b.ingredientMatch?.matchPercentage || 0) - (a.ingredientMatch?.matchPercentage || 0))
      .slice(0, 10); // Limit to 10 external recipes

    return sortedRecipes;

  } catch (error) {
    console.error('❌ Error fetching external recipes:', error);
    return [];
  }
}

// Fetch recipes from a specific source
async function fetchFromSource(source: any, searchQuery: string, mainFood: string, userIngredients: string[]): Promise<ExternalRecipe[]> {
  try {
    console.log(`🔍 Fetching from ${source.name}: ${searchQuery}`);
    
    // For now, we'll generate mock external recipes based on the search query
    // In a real implementation, you would make actual API calls to these sources
    const mockRecipes = generateMockExternalRecipes(source.name, searchQuery, mainFood, userIngredients);
    
    return mockRecipes;

  } catch (error) {
    console.error(`❌ Error fetching from ${source.name}:`, error);
    return [];
  }
}

// Generate mock external recipes (replace with real API calls)
function generateMockExternalRecipes(sourceName: string, searchQuery: string, mainFood: string, userIngredients: string[]): ExternalRecipe[] {
  const recipes: ExternalRecipe[] = [];
  
  // Generate 2-3 mock recipes per source
  const recipeCount = Math.floor(Math.random() * 2) + 2;
  
  for (let i = 0; i < recipeCount; i++) {
    const recipe = generateMockRecipe(sourceName, searchQuery, mainFood, userIngredients, i);
    recipes.push(recipe);
  }
  
  return recipes;
}

// Generate a single mock external recipe
function generateMockRecipe(sourceName: string, searchQuery: string, mainFood: string, userIngredients: string[], index: number): ExternalRecipe {
  const titles = [
    `Best ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Recipe`,
    `Easy ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} from ${sourceName}`,
    `Popular ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Dish`,
    `Classic ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Recipe`,
    `Award-Winning ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)}`
  ];
  
  const title = titles[index % titles.length];
  const ingredients = generateMockIngredients(mainFood, userIngredients);
  const ingredientMatch = calculateIngredientMatch(ingredients, userIngredients);
  
  return {
    id: `external-${sourceName.toLowerCase()}-${Date.now()}-${index}`,
    title,
    image: getMockImage(mainFood, index),
    description: `A popular ${mainFood} recipe from ${sourceName}. This recipe has been tried and tested by thousands of home cooks.`,
    ingredients,
    steps: generateMockSteps(mainFood),
    cookingTime: 30 + Math.floor(Math.random() * 60),
    cuisine: 'International',
    mealType: 'dinner',
    source: sourceName,
    sourceUrl: `https://${sourceName.toLowerCase()}.com/recipe/${title.toLowerCase().replace(/\s+/g, '-')}`,
    rating: 4.0 + Math.random() * 1.0,
    difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
    servings: 4 + Math.floor(Math.random() * 4),
    nutrition: {
      calories: 200 + Math.floor(Math.random() * 400),
      protein: 15 + Math.floor(Math.random() * 25),
      carbs: 20 + Math.floor(Math.random() * 40),
      fat: 8 + Math.floor(Math.random() * 20)
    },
    ingredientMatch
  };
}

// Generate mock ingredients
function generateMockIngredients(mainFood: string, userIngredients: string[]): string[] {
  const ingredients = [mainFood];
  
  // Add user ingredients
  userIngredients.forEach(ingredient => {
    if (ingredient.trim()) {
      ingredients.push(ingredient.trim());
    }
  });
  
  // Add common ingredients
  const commonIngredients = [
    'salt', 'black pepper', 'olive oil', 'garlic', 'onions',
    'herbs', 'spices', 'lemon', 'butter', 'flour'
  ];
  
  // Add 3-5 random common ingredients
  const numCommon = 3 + Math.floor(Math.random() * 3);
  const shuffled = commonIngredients.sort(() => 0.5 - Math.random());
  ingredients.push(...shuffled.slice(0, numCommon));
  
  return ingredients;
}

// Generate mock cooking steps
function generateMockSteps(mainFood: string): string[] {
  return [
    `Prepare the ${mainFood} by cleaning and cutting as needed.`,
    `Season with salt, pepper, and your favorite herbs.`,
    `Heat oil in a large pan over medium heat.`,
    `Cook the ${mainFood} until golden and tender.`,
    `Add additional seasonings and cook for 2-3 more minutes.`,
    `Taste and adjust seasoning as needed.`,
    `Serve hot and enjoy!`
  ];
}

// Calculate ingredient match percentage
function calculateIngredientMatch(recipeIngredients: string[], userIngredients: string[]): { availableIngredients: string[], missingIngredients: string[], matchPercentage: number } {
  if (userIngredients.length === 0) {
    return {
      availableIngredients: [],
      missingIngredients: [],
      matchPercentage: 100
    };
  }
  
  const availableIngredients: string[] = [];
  const missingIngredients: string[] = [];
  
  userIngredients.forEach(ingredient => {
    const found = recipeIngredients.some(recipeIngredient => 
      recipeIngredient.toLowerCase().includes(ingredient.toLowerCase()) ||
      ingredient.toLowerCase().includes(recipeIngredient.toLowerCase())
    );
    
    if (found) {
      availableIngredients.push(ingredient);
    } else {
      missingIngredients.push(ingredient);
    }
  });
  
  const matchPercentage = Math.round((availableIngredients.length / userIngredients.length) * 100);
  
  return {
    availableIngredients,
    missingIngredients,
    matchPercentage
  };
}

// Get mock image based on main food
function getMockImage(mainFood: string, index: number): string {
  const foodType = mainFood.toLowerCase();
  
  if (foodType.includes('chicken')) {
    const images = [
      'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&h=400&fit=crop'
    ];
    return images[index % images.length];
  } else if (foodType.includes('octopus') || foodType.includes('seafood')) {
    const images = [
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=600&h=400&fit=crop'
    ];
    return images[index % images.length];
  } else {
    const images = [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&h=400&fit=crop'
    ];
    return images[index % images.length];
  }
}
