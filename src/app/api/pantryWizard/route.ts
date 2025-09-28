import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import NodeCache from 'node-cache';

// Initialize cache with 30 minute TTL
const cache = new NodeCache({ stdTTL: 1800 });

interface ExternalRecipe {
  title: string;
  ingredients: string[];
  steps: string[];
  cookingTime: number;
  cuisine?: string;
  mealType?: string;
  dietaryStyle?: string;
  image?: string;
  source: string;
  rating?: number;
  difficulty?: string;
  servings?: number;
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  description?: string;
}

interface RecipeFilters {
  cookingTime?: string;
  cuisine?: string;
  mealType?: string;
  dietaryStyle?: string;
}

interface PantryRecipe {
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
  tags: string[];
  createdBy: string;
  matchScore: number;
  rating?: number;
  difficulty?: string;
  servings?: number;
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  seoDescription?: string;
  pantryMatch: {
    availableIngredients: string[];
    missingIngredients: string[];
    matchPercentage: number;
  };
}

interface MealDBRecipe {
  strMeal: string;
  strInstructions: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  [key: string]: string;
}

interface RecipePuppyRecipe {
  title: string;
  ingredients: string;
  thumbnail: string;
}

// Enhanced API endpoints
const MEALDB_BASE = 'https://www.themealdb.com/api/json/v1/1';
const RECIPE_PUPPY_BASE = 'http://www.recipepuppy.com/api';
const UNSPLASH_BASE = 'https://api.unsplash.com/search/photos';

// Comprehensive fallback image pools organized by food type
const FALLBACK_IMAGES = {
  chicken: [
    'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop'
  ],
  beef: [
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1558030006-450675393462?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=600&h=400&fit=crop'
  ],
  fish: [
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=600&h=400&fit=crop'
  ],
  pasta: [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1572441713132-51c75654db73?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=600&h=400&fit=crop'
  ],
  vegetables: [
    'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=600&h=400&fit=crop'
  ],
  rice: [
    'https://images.unsplash.com/photo-1604503468500-a3c769998f12?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&h=400&fit=crop'
  ],
  general: [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1604503468500-a3c769998f12?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1558030006-450675393462?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1563379091339-03246963d51a?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop'
  ]
};

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Pantry Wizard: Starting pantry-based recipe search');
    
    const body = await request.json();
    const { pantryIngredients = [], filters = {} } = body;

    console.log('📝 API: Received pantry request:', { pantryIngredients, filters });

    if (!pantryIngredients || pantryIngredients.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please enter at least one pantry ingredient' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `pantry_recipes_${JSON.stringify(pantryIngredients)}_${JSON.stringify(filters)}`;
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      console.log('⚡ API: Returning cached pantry result');
      return NextResponse.json(cachedResult);
    }

    console.log('🔍 API: Starting Pantry Wizard Recipe Search');

    // Step 1: Fetch existing recipes from various sources
    const externalRecipes = await fetchExistingRecipes(pantryIngredients, filters);
    console.log(`📊 API: Found ${externalRecipes.length} existing recipes`);

    // Step 2: Match recipes with pantry ingredients
    const matchedRecipes = await matchRecipesWithPantry(externalRecipes, pantryIngredients);
    console.log(`🎯 API: Matched ${matchedRecipes.length} recipes with pantry ingredients`);

    const result = {
      success: true,
      recipes: matchedRecipes,
      total: matchedRecipes.length,
      message: `Found ${matchedRecipes.length} recipes you can make with your pantry ingredients`,
      searchMetadata: {
        pantryIngredients,
        filtersApplied: Object.keys(filters).length,
        externalRecipesFound: externalRecipes.length,
        matchedRecipes: matchedRecipes.length
      }
    };

    // Cache the result
    cache.set(cacheKey, result);

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ API: Error in Pantry Wizard:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to find pantry recipes',
        details: process.env.NODE_ENV === 'development' ? (error as Error)?.toString() : 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// Fetch existing recipes from various sources
async function fetchExistingRecipes(pantryIngredients: string[], filters: RecipeFilters): Promise<ExternalRecipe[]> {
  const recipes: ExternalRecipe[] = [];
  
  try {
    // Get unique main ingredients from pantry
    const mainIngredients = extractMainIngredients(pantryIngredients);
    
    // Run searches for each main ingredient
    const searchPromises = mainIngredients.map(ingredient => 
      Promise.allSettled([
        searchTheMealDB(ingredient, filters),
        searchRecipePuppy(ingredient, pantryIngredients)
      ])
    );

    const allResults = await Promise.all(searchPromises);
    
    allResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const [mealDBResult, recipePuppyResult] = result.value;
        if (mealDBResult.status === 'fulfilled') {
          recipes.push(...mealDBResult.value);
        }
        if (recipePuppyResult.status === 'fulfilled') {
          recipes.push(...recipePuppyResult.value);
        }
      }
    });

    // Filter and deduplicate
    const filteredRecipes = recipes
      .filter(recipe => hasPantryIngredients(recipe, pantryIngredients))
      .sort((a, b) => calculatePantryMatchScore(b, pantryIngredients) - calculatePantryMatchScore(a, pantryIngredients))
      .slice(0, 30); // Get more recipes for better matching

    return removeDuplicateRecipes(filteredRecipes);

  } catch (error) {
    console.error('❌ Error in pantry recipe fetch:', error);
    return [];
  }
}

// Match recipes with pantry ingredients and calculate match scores
async function matchRecipesWithPantry(
  externalRecipes: ExternalRecipe[],
  pantryIngredients: string[]
): Promise<PantryRecipe[]> {
  const matchedRecipes: PantryRecipe[] = [];
  
  for (const recipe of externalRecipes) {
    const pantryMatch = calculatePantryMatch(recipe, pantryIngredients);
    
    // Only include recipes with at least 50% ingredient match
    if (pantryMatch.matchPercentage >= 50) {
      const pantryRecipe = await convertToPantryRecipe(recipe, pantryMatch);
      matchedRecipes.push(pantryRecipe);
    }
  }
  
  // Sort by match percentage and limit to 12 recipes
  return matchedRecipes
    .sort((a, b) => b.pantryMatch.matchPercentage - a.pantryMatch.matchPercentage)
    .slice(0, 12);
}

// Calculate pantry match for a recipe
function calculatePantryMatch(recipe: ExternalRecipe, pantryIngredients: string[]): {
  availableIngredients: string[];
  missingIngredients: string[];
  matchPercentage: number;
} {
  const availableIngredients: string[] = [];
  const missingIngredients: string[] = [];
  
  // Normalize pantry ingredients
  const normalizedPantry = pantryIngredients.map(ing => ing.toLowerCase().trim());
  
  // Check each recipe ingredient against pantry
  recipe.ingredients.forEach(recipeIngredient => {
    const normalizedRecipeIng = recipeIngredient.toLowerCase().trim();
    let found = false;
    
    // Check for exact matches and partial matches
    for (const pantryIng of normalizedPantry) {
      if (normalizedRecipeIng.includes(pantryIng) || pantryIng.includes(normalizedRecipeIng.split(' ')[0])) {
        availableIngredients.push(recipeIngredient);
        found = true;
        break;
      }
    }
    
    if (!found) {
      missingIngredients.push(recipeIngredient);
    }
  });
  
  const matchPercentage = Math.round((availableIngredients.length / recipe.ingredients.length) * 100);
  
  return {
    availableIngredients,
    missingIngredients,
    matchPercentage
  };
}

// Convert external recipe to pantry recipe with match info
async function convertToPantryRecipe(
  recipe: ExternalRecipe,
  pantryMatch: { availableIngredients: string[]; missingIngredients: string[]; matchPercentage: number }
): Promise<PantryRecipe> {
  // Get appropriate image
  const image = await getRecipeImage(recipe);
  
  return {
    id: `pantry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: recipe.title,
    image,
    description: recipe.description || `A delicious ${recipe.title} recipe that you can make with your pantry ingredients.`,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    cookingTime: recipe.cookingTime,
    cuisine: recipe.cuisine,
    mealType: recipe.mealType,
    dietaryStyle: recipe.dietaryStyle,
    tags: [recipe.cuisine?.toLowerCase() || 'international', recipe.mealType?.toLowerCase() || 'dinner', 'pantry-friendly'],
    createdBy: 'ViralCarrot Pantry Wizard',
    matchScore: pantryMatch.matchPercentage / 100,
    rating: recipe.rating || 4.0,
    difficulty: recipe.difficulty || 'Medium',
    servings: recipe.servings || 4,
    nutrition: recipe.nutrition,
    seoDescription: `${recipe.title} - Make this delicious recipe with your pantry ingredients. Perfect for when you want to cook without shopping.`,
    pantryMatch
  };
}

// Get recipe image with fallback
async function getRecipeImage(recipe: ExternalRecipe): Promise<string> {
  // Use existing image if available
  if (recipe.image && recipe.image.trim()) {
    return recipe.image;
  }
  
  // Try to get image from Unsplash
  try {
    const query = `${recipe.title} food recipe`;
    const response = await axios.get(`${UNSPLASH_BASE}?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
      headers: {
        'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY || 'demo'}`
      },
      timeout: 5000
    });
    
    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0].urls.regular;
    }
  } catch (error) {
    console.error('❌ Unsplash image fetch error:', error);
  }
  
  // Fallback to curated images based on recipe content
  return getFallbackImage(recipe);
}

// Get fallback image based on recipe content
function getFallbackImage(recipe: ExternalRecipe): string {
  const titleLower = recipe.title.toLowerCase();
  const ingredientsLower = recipe.ingredients.join(' ').toLowerCase();
  
  // Determine food category
  if (titleLower.includes('chicken') || ingredientsLower.includes('chicken')) {
    return FALLBACK_IMAGES.chicken[Math.floor(Math.random() * FALLBACK_IMAGES.chicken.length)];
  } else if (titleLower.includes('beef') || titleLower.includes('steak') || ingredientsLower.includes('beef')) {
    return FALLBACK_IMAGES.beef[Math.floor(Math.random() * FALLBACK_IMAGES.beef.length)];
  } else if (titleLower.includes('fish') || titleLower.includes('salmon') || ingredientsLower.includes('fish')) {
    return FALLBACK_IMAGES.fish[Math.floor(Math.random() * FALLBACK_IMAGES.fish.length)];
  } else if (titleLower.includes('pasta') || titleLower.includes('spaghetti') || ingredientsLower.includes('pasta')) {
    return FALLBACK_IMAGES.pasta[Math.floor(Math.random() * FALLBACK_IMAGES.pasta.length)];
  } else if (titleLower.includes('vegetable') || titleLower.includes('salad') || ingredientsLower.includes('vegetable')) {
    return FALLBACK_IMAGES.vegetables[Math.floor(Math.random() * FALLBACK_IMAGES.vegetables.length)];
  } else if (titleLower.includes('rice') || ingredientsLower.includes('rice')) {
    return FALLBACK_IMAGES.rice[Math.floor(Math.random() * FALLBACK_IMAGES.rice.length)];
  }
  
  return FALLBACK_IMAGES.general[Math.floor(Math.random() * FALLBACK_IMAGES.general.length)];
}

// Extract main ingredients from pantry list
function extractMainIngredients(pantryIngredients: string[]): string[] {
  const mainIngredients = new Set<string>();
  
  pantryIngredients.forEach(ingredient => {
    const lowerIngredient = ingredient.toLowerCase().trim();
    
    // Common main ingredients
    if (lowerIngredient.includes('chicken') || lowerIngredient.includes('poultry')) {
      mainIngredients.add('chicken');
    } else if (lowerIngredient.includes('beef') || lowerIngredient.includes('steak')) {
      mainIngredients.add('beef');
    } else if (lowerIngredient.includes('fish') || lowerIngredient.includes('salmon') || lowerIngredient.includes('tuna')) {
      mainIngredients.add('fish');
    } else if (lowerIngredient.includes('pasta') || lowerIngredient.includes('spaghetti') || lowerIngredient.includes('noodle')) {
      mainIngredients.add('pasta');
    } else if (lowerIngredient.includes('rice')) {
      mainIngredients.add('rice');
    } else if (lowerIngredient.includes('vegetable') || lowerIngredient.includes('broccoli') || lowerIngredient.includes('carrot')) {
      mainIngredients.add('vegetables');
    }
  });
  
  return Array.from(mainIngredients);
}

// Check if recipe has pantry ingredients
function hasPantryIngredients(recipe: ExternalRecipe, pantryIngredients: string[]): boolean {
  const normalizedPantry = pantryIngredients.map(ing => ing.toLowerCase().trim());
  
  let matchCount = 0;
  recipe.ingredients.forEach(recipeIngredient => {
    const normalizedRecipeIng = recipeIngredient.toLowerCase().trim();
    for (const pantryIng of normalizedPantry) {
      if (normalizedRecipeIng.includes(pantryIng) || pantryIng.includes(normalizedRecipeIng.split(' ')[0])) {
        matchCount++;
        break;
      }
    }
  });
  
  // Require at least 30% ingredient match
  return matchCount >= Math.ceil(recipe.ingredients.length * 0.3);
}

// Calculate pantry match score
function calculatePantryMatchScore(recipe: ExternalRecipe, pantryIngredients: string[]): number {
  const normalizedPantry = pantryIngredients.map(ing => ing.toLowerCase().trim());
  let score = 0;
  
  recipe.ingredients.forEach(recipeIngredient => {
    const normalizedRecipeIng = recipeIngredient.toLowerCase().trim();
    for (const pantryIng of normalizedPantry) {
      if (normalizedRecipeIng.includes(pantryIng) || pantryIng.includes(normalizedRecipeIng.split(' ')[0])) {
        score += 1;
        break;
      }
    }
  });
  
  return score / recipe.ingredients.length;
}

// Remove duplicate recipes
function removeDuplicateRecipes(recipes: ExternalRecipe[]): ExternalRecipe[] {
  const seen = new Set<string>();
  return recipes.filter(recipe => {
    const key = recipe.title.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// API search functions
async function searchTheMealDB(mainFood: string, _filters: RecipeFilters): Promise<ExternalRecipe[]> {
  try {
    const response = await axios.get(`${MEALDB_BASE}/search.php?s=${encodeURIComponent(mainFood)}`);
    if (response.data.meals) {
      return response.data.meals.slice(0, 5).map((meal: MealDBRecipe) => ({
        title: meal.strMeal,
        ingredients: extractMealDBIngredients(meal),
        steps: meal.strInstructions ? meal.strInstructions.split('\n').filter(step => step.trim()) : [],
        cookingTime: 30,
        cuisine: meal.strArea || 'International',
        mealType: 'dinner',
        image: meal.strMealThumb || '',
        source: 'TheMealDB',
        rating: 4.2,
        difficulty: 'Medium',
        servings: 4,
        description: `A traditional ${meal.strArea || 'International'} recipe from TheMealDB`
      }));
    }
  } catch (error) {
    console.error('❌ TheMealDB search error:', error);
  }
  return [];
}

async function searchRecipePuppy(mainFood: string, pantryIngredients: string[]): Promise<ExternalRecipe[]> {
  try {
    const ingredientQuery = pantryIngredients.length > 0 ? pantryIngredients.join(',') : '';
    const url = `${RECIPE_PUPPY_BASE}/?q=${encodeURIComponent(mainFood)}&i=${encodeURIComponent(ingredientQuery)}`;
    const response = await axios.get(url, { timeout: 5000 });
    
    if (response.data && response.data.results) {
      return response.data.results.slice(0, 5).map((recipe: RecipePuppyRecipe) => ({
        title: recipe.title,
        ingredients: recipe.ingredients ? recipe.ingredients.split(', ') : [],
        steps: [],
        cookingTime: 30,
        cuisine: 'International',
        mealType: 'dinner',
        image: recipe.thumbnail || '',
        source: 'RecipePuppy',
        rating: 4.0,
        description: `A delicious ${mainFood} recipe from RecipePuppy`
      }));
    }
  } catch (error) {
    console.error('❌ RecipePuppy search error:', error);
  }
  return [];
}

function extractMealDBIngredients(meal: MealDBRecipe): string[] {
  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure ? measure.trim() + ' ' : ''}${ingredient.trim()}`);
    }
  }
  return ingredients;
}
