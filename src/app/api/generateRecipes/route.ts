import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
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
}

interface SynthesizedRecipe {
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
}

interface RecipeFilters {
  cookingTime?: string;
  cuisine?: string;
  mealType?: string;
  dietaryStyle?: string;
}

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
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

export async function POST(request: NextRequest) {
  try {
    console.log('🍳 API: Starting enhanced recipe synthesis');
    
    const body = await request.json();
    const { mainFood, ingredients = [], filters = {} } = body;

    console.log('📝 API: Received request:', { mainFood, ingredients, filters });

    if (!mainFood || !mainFood.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please enter a main food item' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `recipes_${mainFood}_${JSON.stringify(ingredients)}_${JSON.stringify(filters)}`;
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      console.log('⚡ API: Returning cached result');
      return NextResponse.json(cachedResult);
    }

    console.log('🔍 API: Starting comprehensive recipe search');

    // Step 1: Search for existing recipes from multiple sources in parallel
    const [externalRecipes, nutritionData] = await Promise.all([
      searchExternalRecipesParallel(mainFood, ingredients, filters as RecipeFilters),
      fetchNutritionData(mainFood)
    ]);
    
    console.log(`📊 API: Found ${externalRecipes.length} external recipes`);

    // Step 2: Synthesize unique ViralCarrot recipes with advanced matching
    const synthesizedRecipes = await synthesizeRecipesWithAdvancedMatching(
      externalRecipes, 
      mainFood, 
      ingredients, 
      filters as RecipeFilters,
      nutritionData
    );
    
    console.log(`🎯 API: Synthesized ${synthesizedRecipes.length} recipes`);

    const result = {
      success: true,
      recipes: synthesizedRecipes,
      total: synthesizedRecipes.length,
      message: `Created ${synthesizedRecipes.length} unique recipes by ViralCarrot`,
      sources: [...new Set(externalRecipes.map(r => r.source))],
      searchMetadata: {
        mainFood,
        ingredientCount: ingredients.length,
        filtersApplied: Object.keys(filters).length,
        externalRecipesFound: externalRecipes.length
      }
    };

    // Cache the result
    cache.set(cacheKey, result);

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ API: Error in recipe synthesis:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to synthesize recipes',
        details: process.env.NODE_ENV === 'development' ? (error as Error)?.toString() : 'Internal server error'
      },
      { status: 500 }
    );
  }
}

async function searchExternalRecipesParallel(
  mainFood: string, 
  ingredients: string[], 
  filters: RecipeFilters
): Promise<ExternalRecipe[]> {
  const recipes: ExternalRecipe[] = [];
  
  try {
    // Run all searches in parallel for better performance
    const searchPromises = [
      searchTheMealDBComprehensive(mainFood),
      searchRecipePuppy(mainFood, ingredients),
      scrapeRecipeSitesEnhanced(mainFood)
    ];

    const results = await Promise.allSettled(searchPromises);
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        recipes.push(...result.value);
        console.log(`✅ Search ${index + 1} completed: ${result.value.length} recipes`);
      } else {
        console.warn(`⚠️ Search ${index + 1} failed:`, result.reason);
      }
    });

    // Search for related foods if we don't have enough recipes
    if (recipes.length < 5) {
      const relatedRecipes = await searchRelatedFoodsEnhanced(mainFood);
      recipes.push(...relatedRecipes);
    }

  } catch (error) {
    console.error('❌ Error in parallel recipe search:', error);
  }
  
  // Remove duplicates and sort by relevance
  const uniqueRecipes = removeDuplicateRecipes(recipes);
  return rankRecipesByRelevance(uniqueRecipes, mainFood, ingredients);
}

async function searchTheMealDBComprehensive(mainFood: string): Promise<ExternalRecipe[]> {
  const recipes: ExternalRecipe[] = [];
  
  try {
    const searchPromises = [
      axios.get(`${MEALDB_BASE}/search.php?s=${encodeURIComponent(mainFood)}`),
      axios.get(`${MEALDB_BASE}/filter.php?i=${encodeURIComponent(mainFood)}`),
      // Try searching by first letter for broader results
      axios.get(`${MEALDB_BASE}/search.php?f=${mainFood.charAt(0).toLowerCase()}`)
    ];

    const responses = await Promise.allSettled(searchPromises);
    
    responses.forEach((response) => {
      if (response.status === 'fulfilled' && response.value.data.meals) {
        const meals = response.value.data.meals.slice(0, 3);
        meals.forEach((meal: MealDBRecipe) => {
          recipes.push(createEnhancedMealDBRecipe(meal));
        });
      }
    });

  } catch (error) {
    console.error('❌ TheMealDB search error:', error);
  }
  
  return recipes;
}

async function searchRecipePuppy(mainFood: string, ingredients: string[]): Promise<ExternalRecipe[]> {
  try {
    const ingredientQuery = ingredients.length > 0 ? ingredients.join(',') : '';
    const url = `${RECIPE_PUPPY_BASE}/?q=${encodeURIComponent(mainFood)}&i=${encodeURIComponent(ingredientQuery)}`;
    
    const response = await axios.get(url, { timeout: 5000 });
    
    if (response.data && response.data.results) {
      return response.data.results.slice(0, 5).map((recipe: RecipePuppyRecipe) => ({
        title: recipe.title,
        ingredients: recipe.ingredients ? recipe.ingredients.split(', ') : [],
        steps: [], // Recipe Puppy doesn't provide steps
        cookingTime: 30,
        cuisine: 'International',
        mealType: 'dinner',
        image: recipe.thumbnail || '',
        source: 'RecipePuppy',
        rating: 4.0
      }));
    }
  } catch (error) {
    console.error('❌ RecipePuppy search error:', error);
  }
  
  return [];
}

async function scrapeRecipeSitesEnhanced(mainFood: string): Promise<ExternalRecipe[]> {
  const recipes: ExternalRecipe[] = [];
  
  const scrapingPromises = [
    scrapeAllRecipesEnhanced(mainFood),
    scrapeFoodNetworkEnhanced(mainFood),
    scrapeBBCGoodFoodEnhanced(mainFood)
  ];

  const results = await Promise.allSettled(scrapingPromises);
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      recipes.push(...result.value);
      console.log(`✅ Scraping ${index + 1} completed: ${result.value.length} recipes`);
    } else {
      console.warn(`⚠️ Scraping ${index + 1} failed:`, result.reason);
    }
  });
  
  return recipes;
}

async function scrapeAllRecipesEnhanced(mainFood: string): Promise<ExternalRecipe[]> {
  try {
    const searchUrl = `https://www.allrecipes.com/search?q=${encodeURIComponent(mainFood)}`;
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    const recipes: ExternalRecipe[] = [];
    
    // Enhanced selectors for AllRecipes
    $('.mntl-card-list-items .card__content, .recipe-summary__item').slice(0, 3).each((_, element) => {
      const title = $(element).find('.card__title, .recipe-summary__item-title').text().trim();
      const image = $(element).find('img').attr('src') || '';
      const cookingTime = extractCookingTime($(element).text());
      const rating = extractRating($(element).text());
      
      if (title) {
        recipes.push({
          title,
          ingredients: [],
          steps: [],
          cookingTime,
          cuisine: 'International',
          mealType: 'dinner',
          image,
          source: 'AllRecipes',
          rating,
          difficulty: 'Medium'
        });
      }
    });
    
    return recipes;
  } catch (error) {
    console.error('❌ AllRecipes enhanced scraping error:', error);
    return [];
  }
}

async function scrapeFoodNetworkEnhanced(mainFood: string): Promise<ExternalRecipe[]> {
  try {
    const searchUrl = `https://www.foodnetwork.com/search/${encodeURIComponent(mainFood)}`;
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    const recipes: ExternalRecipe[] = [];
    
    $('.m-MediaBlock__m-MediaWrap, .o-RecipeResult').slice(0, 2).each((_, element) => {
      const title = $(element).find('.m-MediaBlock__a-HeadlineText, .o-RecipeResult__a-Title').text().trim();
      const image = $(element).find('img').attr('src') || '';
      
      if (title) {
        recipes.push({
          title,
          ingredients: [],
          steps: [],
          cookingTime: 35,
          cuisine: 'American',
          mealType: 'dinner',
          image,
          source: 'Food Network',
          rating: 4.2,
          difficulty: 'Medium'
        });
      }
    });
    
    return recipes;
  } catch (error) {
    console.error('❌ Food Network scraping error:', error);
    return [];
  }
}

async function scrapeBBCGoodFoodEnhanced(mainFood: string): Promise<ExternalRecipe[]> {
  try {
    const searchUrl = `https://www.bbcgoodfood.com/search/recipes?q=${encodeURIComponent(mainFood)}`;
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    const recipes: ExternalRecipe[] = [];
    
    $('.card__content, .teaser-item__content').slice(0, 2).each((_, element) => {
      const title = $(element).find('.card__title, .teaser-item__title').text().trim();
      const image = $(element).find('img').attr('src') || '';
      
      if (title) {
        recipes.push({
          title,
          ingredients: [],
          steps: [],
          cookingTime: 30,
          cuisine: 'British',
          mealType: 'dinner',
          image,
          source: 'BBC Good Food',
          rating: 4.3,
          difficulty: 'Easy'
        });
      }
    });
    
    return recipes;
  } catch (error) {
    console.error('❌ BBC Good Food scraping error:', error);
    return [];
  }
}

async function fetchNutritionData(mainFood: string): Promise<NutritionData> {
  try {
    // This could integrate with nutrition APIs like USDA FoodData Central
    // For now, return estimated nutrition based on common foods
    const nutritionEstimates: { [key: string]: NutritionData } = {
      'chicken': { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
      'beef': { calories: 250, protein: 26, carbs: 0, fat: 15 },
      'salmon': { calories: 208, protein: 22, carbs: 0, fat: 12 },
      'tofu': { calories: 70, protein: 8, carbs: 2, fat: 4 },
      'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
      'pasta': { calories: 131, protein: 5, carbs: 25, fat: 1.1 }
    };
    
    return nutritionEstimates[mainFood.toLowerCase()] || { calories: 150, protein: 10, carbs: 15, fat: 5 };
  } catch (error) {
    console.error('❌ Nutrition data fetch error:', error);
    return { calories: 150, protein: 10, carbs: 15, fat: 5 };
  }
}

// Missing function implementations
function extractCookingTime(text: string): number {
  const timeMatch = text.match(/(\d+)\s*(?:min|minutes|hrs|hours)/i);
  if (timeMatch) {
    const time = parseInt(timeMatch[1]);
    return text.toLowerCase().includes('hr') ? time * 60 : time;
  }
  return 30; // Default cooking time
}

function extractRating(text: string): number {
  const ratingMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:star|stars|\/5)/i);
  return ratingMatch ? parseFloat(ratingMatch[1]) : 4.0;
}

function removeDuplicateRecipes(recipes: ExternalRecipe[]): ExternalRecipe[] {
  const seen = new Set<string>();
  return recipes.filter(recipe => {
    const key = recipe.title.toLowerCase().trim();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function rankRecipesByRelevance(recipes: ExternalRecipe[], mainFood: string, ingredients: string[]): ExternalRecipe[] {
  return recipes.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    
    // Score based on title relevance
    if (a.title.toLowerCase().includes(mainFood.toLowerCase())) scoreA += 10;
    if (b.title.toLowerCase().includes(mainFood.toLowerCase())) scoreB += 10;
    
    // Score based on ingredient matches
    ingredients.forEach(ing => {
      if (a.ingredients.some(ingredient => ingredient.toLowerCase().includes(ing.toLowerCase()))) scoreA += 5;
      if (b.ingredients.some(ingredient => ingredient.toLowerCase().includes(ing.toLowerCase()))) scoreB += 5;
    });
    
    // Score based on rating
    scoreA += (a.rating || 0) * 2;
    scoreB += (b.rating || 0) * 2;
    
    return scoreB - scoreA;
  });
}

async function synthesizeRecipesWithAdvancedMatching(
  externalRecipes: ExternalRecipe[],
  mainFood: string,
  ingredients: string[],
  filters: RecipeFilters,
  nutritionData: NutritionData
): Promise<SynthesizedRecipe[]> {
  const synthesizedRecipes: SynthesizedRecipe[] = [];
  
  // Create unique recipes based on external data
  externalRecipes.slice(0, 6).forEach((recipe, index) => {
    const matchScore = calculateMatchScore(recipe, mainFood, ingredients);
    
    const synthesizedRecipe: SynthesizedRecipe = {
      id: `viral-${Date.now()}-${index}`,
      title: `ViralCarrot's ${recipe.title}`,
      image: recipe.image || '/api/placeholder/400/300',
      description: `A unique ${mainFood} recipe created by ViralCarrot, inspired by ${recipe.source}`,
      ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : generateIngredients(mainFood, ingredients),
      steps: recipe.steps.length > 0 ? recipe.steps : generateSteps(mainFood),
      cookingTime: recipe.cookingTime,
      cuisine: recipe.cuisine,
      mealType: recipe.mealType || 'dinner',
      dietaryStyle: recipe.dietaryStyle,
      tags: generateTags(recipe, mainFood),
      createdBy: 'ViralCarrot AI Chef',
      matchScore,
      rating: recipe.rating,
      difficulty: recipe.difficulty || 'Medium',
      servings: recipe.servings || 4,
      nutrition: recipe.nutrition || nutritionData
    };
    
    synthesizedRecipes.push(synthesizedRecipe);
  });
  
  // If we don't have enough recipes, generate some from scratch
  while (synthesizedRecipes.length < 3) {
    const index = synthesizedRecipes.length;
    synthesizedRecipes.push({
      id: `viral-generated-${Date.now()}-${index}`,
      title: `ViralCarrot's Special ${mainFood} Recipe`,
      image: '/api/placeholder/400/300',
      description: `A creative ${mainFood} recipe crafted by ViralCarrot's AI Chef`,
      ingredients: generateIngredients(mainFood, ingredients),
      steps: generateSteps(mainFood),
      cookingTime: 30 + (index * 10),
      cuisine: 'Fusion',
      mealType: 'dinner',
      tags: [mainFood, 'viral-carrot', 'ai-created'],
      createdBy: 'ViralCarrot AI Chef',
      matchScore: 8.0,
      rating: 4.5,
      difficulty: 'Medium',
      servings: 4,
      nutrition: nutritionData
    });
  }
  
  return synthesizedRecipes;
}

async function searchRelatedFoodsEnhanced(mainFood: string): Promise<ExternalRecipe[]> {
  // Simple related food search - could be enhanced with ML
  const relatedFoods = {
    'chicken': ['poultry', 'meat', 'protein'],
    'beef': ['meat', 'steak', 'protein'],
    'fish': ['seafood', 'salmon', 'protein'],
    'vegetables': ['veggie', 'plant', 'healthy'],
    'pasta': ['noodles', 'italian', 'carbs']
  };
  
  const related = relatedFoods[mainFood.toLowerCase() as keyof typeof relatedFoods] || [mainFood];
  const recipes: ExternalRecipe[] = [];
  
  for (const relatedFood of related.slice(0, 2)) {
    try {
      const response = await axios.get(`${MEALDB_BASE}/search.php?s=${encodeURIComponent(relatedFood)}`);
      if (response.data.meals) {
        response.data.meals.slice(0, 2).forEach((meal: MealDBRecipe) => {
          recipes.push(createEnhancedMealDBRecipe(meal));
        });
      }
    } catch (error) {
      console.error(`Error searching for related food ${relatedFood}:`, error);
    }
  }
  
  return recipes;
}

function createEnhancedMealDBRecipe(meal: MealDBRecipe): ExternalRecipe {
  const ingredients: string[] = [];
  
  // Extract ingredients from MealDB format
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure ? measure.trim() + ' ' : ''}${ingredient.trim()}`);
    }
  }
  
  return {
    title: meal.strMeal,
    ingredients,
    steps: meal.strInstructions ? meal.strInstructions.split('\n').filter(step => step.trim()) : [],
    cookingTime: extractCookingTime(meal.strInstructions || ''),
    cuisine: meal.strArea || 'International',
    mealType: 'dinner',
    image: meal.strMealThumb,
    source: 'TheMealDB',
    rating: 4.2,
    difficulty: 'Medium',
    servings: 4
  };
}

function calculateMatchScore(recipe: ExternalRecipe, mainFood: string, ingredients: string[]): number {
  let score = 5.0; // Base score
  
  // Title match
  if (recipe.title.toLowerCase().includes(mainFood.toLowerCase())) {
    score += 3.0;
  }
  
  // Ingredient matches
  let ingredientMatches = 0;
  ingredients.forEach(ing => {
    if (recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(ing.toLowerCase()))) {
      ingredientMatches++;
    }
  });
  score += (ingredientMatches / Math.max(ingredients.length, 1)) * 2.0;
  
  // Rating bonus
  if (recipe.rating) {
    score += recipe.rating * 0.5;
  }
  
  return Math.min(score, 10.0);
}

function generateIngredients(mainFood: string, userIngredients: string[]): string[] {
  const baseIngredients = [
    `1 lb ${mainFood}`,
    '2 tablespoons olive oil',
    '1 onion, diced',
    '2 cloves garlic, minced',
    'Salt and pepper to taste'
  ];
  
  // Add user ingredients
  userIngredients.forEach(ing => {
    if (!baseIngredients.some(base => base.toLowerCase().includes(ing.toLowerCase()))) {
      baseIngredients.push(`1 cup ${ing}`);
    }
  });
  
  return baseIngredients;
}

function generateSteps(mainFood: string): string[] {
  return [
    `Prepare the ${mainFood} by cleaning and cutting into appropriate pieces.`,
    'Heat olive oil in a large pan over medium-high heat.',
    `Add the ${mainFood} and cook until browned on all sides.`,
    'Add onions and garlic, cook until fragrant.',
    'Season with salt and pepper.',
    'Cook for additional 10-15 minutes until fully cooked.',
    'Serve hot and enjoy your ViralCarrot creation!'
  ];
}

function generateTags(recipe: ExternalRecipe, mainFood: string): string[] {
  const tags = [mainFood.toLowerCase(), 'viral-carrot'];
  
  if (recipe.cuisine) tags.push(recipe.cuisine.toLowerCase());
  if (recipe.difficulty) tags.push(recipe.difficulty.toLowerCase());
  if (recipe.mealType) tags.push(recipe.mealType.toLowerCase());
  
  return [...new Set(tags)];
}
