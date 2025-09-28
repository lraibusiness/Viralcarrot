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
  description?: string;
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
  seoDescription?: string;
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

interface UnsplashImage {
  urls: {
    regular: string;
    small: string;
  };
  alt_description: string;
}

// Enhanced API endpoints
const MEALDB_BASE = 'https://www.themealdb.com/api/json/v1/1';
const RECIPE_PUPPY_BASE = 'http://www.recipepuppy.com/api';
const UNSPLASH_BASE = 'https://api.unsplash.com/search/photos';

export async function POST(request: NextRequest) {
  try {
    console.log('🍳 Smart Recipe Composer v2: Starting enhanced recipe synthesis');
    
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
    const cacheKey = `recipes_v2_${mainFood}_${JSON.stringify(ingredients)}_${JSON.stringify(filters)}`;
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      console.log('⚡ API: Returning cached result');
      return NextResponse.json(cachedResult);
    }

    console.log('🔍 API: Starting Smart Recipe Composer v2');

    // Step 1: Enhanced data aggregation from multiple sources
    const [externalRecipes, nutritionData] = await Promise.all([
      searchExternalRecipesEnhanced(mainFood, ingredients, filters as RecipeFilters),
      fetchNutritionData(mainFood)
    ]);
    
    console.log(`📊 API: Found ${externalRecipes.length} external recipes`);

    // Step 2: Smart recipe synthesis with context-aware generation
    const synthesizedRecipes = await synthesizeRecipesSmart(
      externalRecipes, 
      mainFood, 
      ingredients, 
      filters as RecipeFilters,
      nutritionData
    );
    
    console.log(`�� API: Synthesized ${synthesizedRecipes.length} smart recipes`);

    const result = {
      success: true,
      recipes: synthesizedRecipes,
      total: synthesizedRecipes.length,
      message: `Created ${synthesizedRecipes.length} authentic recipes by ViralCarrot Smart Composer`,
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
    console.error('❌ API: Error in Smart Recipe Composer v2:', error);
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

// Enhanced data aggregation with better filtering
async function searchExternalRecipesEnhanced(
  mainFood: string, 
  ingredients: string[], 
  filters: RecipeFilters
): Promise<ExternalRecipe[]> {
  const recipes: ExternalRecipe[] = [];
  
  try {
    // Run all searches in parallel for better performance
    const searchPromises = [
      searchTheMealDBEnhanced(mainFood, filters),
      searchRecipePuppyEnhanced(mainFood, ingredients),
      scrapeRecipeSitesSmart(mainFood, filters),
      searchEdamamFallback(mainFood, ingredients) // New fallback API
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

    // Smart filtering and merging
    const filteredRecipes = recipes
      .filter(recipe => includesMainIngredient(recipe, mainFood))
      .filter(recipe => matchUserIngredients(recipe, ingredients))
      .filter(recipe => matchFilters(recipe, filters))
      .sort((a, b) => calculateRelevanceScore(b, mainFood, ingredients) - calculateRelevanceScore(a, mainFood, ingredients))
      .slice(0, 15); // Get top 15 most relevant

    return removeDuplicateRecipes(filteredRecipes);

  } catch (error) {
    console.error('❌ Error in enhanced recipe search:', error);
    return [];
  }
}

// Enhanced TheMealDB search with filtering
async function searchTheMealDBEnhanced(mainFood: string, filters: RecipeFilters): Promise<ExternalRecipe[]> {
  const recipes: ExternalRecipe[] = [];
  
  try {
    const searchPromises = [
      axios.get(`${MEALDB_BASE}/search.php?s=${encodeURIComponent(mainFood)}`),
      axios.get(`${MEALDB_BASE}/filter.php?i=${encodeURIComponent(mainFood)}`),
      axios.get(`${MEALDB_BASE}/search.php?f=${mainFood.charAt(0).toLowerCase()}`)
    ];

    const responses = await Promise.allSettled(searchPromises);
    
    responses.forEach((response) => {
      if (response.status === 'fulfilled' && response.value.data.meals) {
        const meals = response.value.data.meals.slice(0, 5);
        meals.forEach((meal: MealDBRecipe) => {
          const recipe = createEnhancedMealDBRecipe(meal);
          if (matchFilters(recipe, filters)) {
            recipes.push(recipe);
          }
        });
      }
    });

  } catch (error) {
    console.error('❌ TheMealDB enhanced search error:', error);
  }
  
  return recipes;
}

// Enhanced RecipePuppy search
async function searchRecipePuppyEnhanced(mainFood: string, ingredients: string[]): Promise<ExternalRecipe[]> {
  try {
    const ingredientQuery = ingredients.length > 0 ? ingredients.join(',') : '';
    const url = `${RECIPE_PUPPY_BASE}/?q=${encodeURIComponent(mainFood)}&i=${encodeURIComponent(ingredientQuery)}`;
    
    const response = await axios.get(url, { timeout: 5000 });
    
    if (response.data && response.data.results) {
      return response.data.results.slice(0, 8).map((recipe: RecipePuppyRecipe) => ({
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
    console.error('❌ RecipePuppy enhanced search error:', error);
  }
  
  return [];
}

// Smart web scraping with better selectors
async function scrapeRecipeSitesSmart(mainFood: string, filters: RecipeFilters): Promise<ExternalRecipe[]> {
  const recipes: ExternalRecipe[] = [];
  
  const scrapingPromises = [
    scrapeAllRecipesSmart(mainFood),
    scrapeFoodNetworkSmart(mainFood),
    scrapeBBCGoodFoodSmart(mainFood),
    scrapeEpicuriousSmart(mainFood)
  ];

  const results = await Promise.allSettled(scrapingPromises);
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      recipes.push(...result.value);
      console.log(`✅ Smart Scraping ${index + 1} completed: ${result.value.length} recipes`);
    } else {
      console.warn(`⚠️ Smart Scraping ${index + 1} failed:`, result.reason);
    }
  });
  
  return recipes;
}

// Smart AllRecipes scraping
async function scrapeAllRecipesSmart(mainFood: string): Promise<ExternalRecipe[]> {
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
    
    $('.mntl-card-list-items .card__content, .recipe-summary__item').slice(0, 4).each((_, element) => {
      const title = $(element).find('.card__title, .recipe-summary__item-title').text().trim();
      const image = $(element).find('img').attr('src') || '';
      const cookingTime = extractCookingTime($(element).text());
      const rating = extractRating($(element).text());
      const description = $(element).find('.card__summary, .recipe-summary__item-summary').text().trim();
      
      if (title && title.toLowerCase().includes(mainFood.toLowerCase())) {
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
          difficulty: 'Medium',
          description: description || `A delicious ${mainFood} recipe from AllRecipes`
        });
      }
    });
    
    return recipes;
  } catch (error) {
    console.error('❌ AllRecipes smart scraping error:', error);
    return [];
  }
}

// Smart Food Network scraping
async function scrapeFoodNetworkSmart(mainFood: string): Promise<ExternalRecipe[]> {
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
    
    $('.m-MediaBlock__m-MediaWrap, .o-RecipeResult').slice(0, 3).each((_, element) => {
      const title = $(element).find('.m-MediaBlock__a-HeadlineText, .o-RecipeResult__a-Title').text().trim();
      const image = $(element).find('img').attr('src') || '';
      const description = $(element).find('.m-MediaBlock__a-Description, .o-RecipeResult__a-Description').text().trim();
      
      if (title && title.toLowerCase().includes(mainFood.toLowerCase())) {
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
          difficulty: 'Medium',
          description: description || `A professional ${mainFood} recipe from Food Network`
        });
      }
    });
    
    return recipes;
  } catch (error) {
    console.error('❌ Food Network smart scraping error:', error);
    return [];
  }
}

// Smart BBC Good Food scraping
async function scrapeBBCGoodFoodSmart(mainFood: string): Promise<ExternalRecipe[]> {
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
    
    $('.card__content, .teaser-item__content').slice(0, 3).each((_, element) => {
      const title = $(element).find('.card__title, .teaser-item__title').text().trim();
      const image = $(element).find('img').attr('src') || '';
      const description = $(element).find('.card__summary, .teaser-item__summary').text().trim();
      
      if (title && title.toLowerCase().includes(mainFood.toLowerCase())) {
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
          difficulty: 'Easy',
          description: description || `A healthy ${mainFood} recipe from BBC Good Food`
        });
      }
    });
    
    return recipes;
  } catch (error) {
    console.error('❌ BBC Good Food smart scraping error:', error);
    return [];
  }
}

// Smart Epicurious scraping
async function scrapeEpicuriousSmart(mainFood: string): Promise<ExternalRecipe[]> {
  try {
    const searchUrl = `https://www.epicurious.com/search/${encodeURIComponent(mainFood)}`;
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    const recipes: ExternalRecipe[] = [];
    
    $('.recipe-content-card, .recipe-item').slice(0, 2).each((_, element) => {
      const title = $(element).find('.recipe-content-card__title, .recipe-item__title').text().trim();
      const image = $(element).find('img').attr('src') || '';
      const description = $(element).find('.recipe-content-card__summary, .recipe-item__summary').text().trim();
      
      if (title && title.toLowerCase().includes(mainFood.toLowerCase())) {
        recipes.push({
          title,
          ingredients: [],
          steps: [],
          cookingTime: 40,
          cuisine: 'Gourmet',
          mealType: 'dinner',
          image,
          source: 'Epicurious',
          rating: 4.5,
          difficulty: 'Hard',
          description: description || `A gourmet ${mainFood} recipe from Epicurious`
        });
      }
    });
    
    return recipes;
  } catch (error) {
    console.error('❌ Epicurious smart scraping error:', error);
    return [];
  }
}

// New: Edamam fallback API (free tier)
async function searchEdamamFallback(mainFood: string, ingredients: string[]): Promise<ExternalRecipe[]> {
  try {
    // Note: This would require Edamam API key
    // For now, return empty array but structure is ready
    return [];
  } catch (error) {
    console.error('❌ Edamam fallback search error:', error);
    return [];
  }
}

// Smart recipe synthesis with context-aware generation
async function synthesizeRecipesSmart(
  externalRecipes: ExternalRecipe[],
  mainFood: string,
  ingredients: string[],
  filters: RecipeFilters,
  nutritionData: NutritionData
): Promise<SynthesizedRecipe[]> {
  const synthesizedRecipes: SynthesizedRecipe[] = [];
  
  // Process external recipes with smart enhancement
  externalRecipes.slice(0, 8).forEach((recipe, index) => {
    const matchScore = calculateRelevanceScore(recipe, mainFood, ingredients);
    const cuisine = recipe.cuisine || determineCuisineFromTitle(recipe.title);
    const mealType = recipe.mealType || determineMealTypeFromTitle(recipe.title);
    
    const synthesizedRecipe: SynthesizedRecipe = {
      id: `viral-smart-${Date.now()}-${index}`,
      title: enhanceRecipeTitle(recipe.title, mainFood),
      image: recipe.image || await getUnsplashImage(mainFood, cuisine),
      description: generateSmartDescription(recipe.title, mainFood, cuisine, mealType),
      ingredients: generateSmartIngredients(recipe.ingredients, ingredients, mainFood),
      steps: generateSmartSteps(mainFood, cuisine, mealType, recipe.ingredients),
      cookingTime: recipe.cookingTime || estimateCookingTime(mainFood, mealType),
      cuisine: cuisine,
      mealType: mealType,
      dietaryStyle: recipe.dietaryStyle || determineDietaryStyle(recipe.ingredients),
      tags: generateSmartTags(recipe, mainFood, cuisine, mealType),
      createdBy: 'ViralCarrot Smart Composer',
      matchScore,
      rating: recipe.rating || 4.5,
      difficulty: recipe.difficulty || determineDifficulty(mainFood, mealType),
      servings: recipe.servings || 4,
      nutrition: recipe.nutrition || nutritionData,
      seoDescription: generateSEODescription(recipe.title, mainFood, cuisine, mealType)
    };
    
    synthesizedRecipes.push(synthesizedRecipe);
  });
  
  // Generate additional smart recipes if needed
  while (synthesizedRecipes.length < 6) {
    const index = synthesizedRecipes.length;
    const cuisine = filters.cuisine || getRandomCuisine();
    const mealType = filters.mealType || getRandomMealType();
    
    synthesizedRecipes.push({
      id: `viral-generated-smart-${Date.now()}-${index}`,
      title: generateCreativeTitle(mainFood, cuisine, mealType),
      image: await getUnsplashImage(mainFood, cuisine),
      description: generateSmartDescription(`${mainFood} ${cuisine} recipe`, mainFood, cuisine, mealType),
      ingredients: generateSmartIngredients([], ingredients, mainFood),
      steps: generateSmartSteps(mainFood, cuisine, mealType, ingredients),
      cookingTime: estimateCookingTime(mainFood, mealType),
      cuisine: cuisine,
      mealType: mealType,
      tags: [mainFood.toLowerCase(), 'viral-carrot', 'smart-composer', cuisine.toLowerCase()],
      createdBy: 'ViralCarrot Smart Composer',
      matchScore: 8.5,
      rating: 4.6,
      difficulty: determineDifficulty(mainFood, mealType),
      servings: 4,
      nutrition: nutritionData,
      seoDescription: generateSEODescription(`${mainFood} ${cuisine} recipe`, mainFood, cuisine, mealType)
    });
  }
  
  return synthesizedRecipes;
}

// Context-aware step generation engine
function generateSmartSteps(mainFood: string, cuisine: string, mealType: string, ingredients: string[]): string[] {
  const prepSteps = generatePrepSteps(mainFood, cuisine);
  const cookingSteps = generateCookingSteps(mainFood, cuisine, mealType, ingredients);
  const finishingSteps = generateFinishingSteps(mainFood, cuisine, mealType);
  
  return [...prepSteps, ...cookingSteps, ...finishingSteps];
}

function generatePrepSteps(mainFood: string, cuisine: string): string[] {
  const basePrep = [
    `Wash and prepare the ${mainFood}, trimming any excess fat or unwanted parts.`,
    'Gather all your ingredients and have them ready for cooking.'
  ];
  
  if (cuisine.toLowerCase().includes('asian')) {
    return [
      ...basePrep,
      `Cut the ${mainFood} into bite-sized pieces for even cooking.`,
      'Prepare a marinade with soy sauce, ginger, and garlic if desired.'
    ];
  } else if (cuisine.toLowerCase().includes('italian')) {
    return [
      ...basePrep,
      `Season the ${mainFood} generously with salt, pepper, and Italian herbs.`,
      'Let the meat rest at room temperature for 15-20 minutes before cooking.'
    ];
  } else {
    return [
      ...basePrep,
      `Season the ${mainFood} with salt, pepper, and your preferred spices.`,
      'Allow the seasoning to penetrate for 10-15 minutes.'
    ];
  }
}

function generateCookingSteps(mainFood: string, cuisine: string, mealType: string, ingredients: string[]): string[] {
  const baseCooking = [
    'Heat 1-2 tablespoons of oil in a large skillet or pan over medium-high heat.',
    `Add the ${mainFood} and cook until well-browned on all sides.`
  ];
  
  if (mealType.toLowerCase().includes('soup') || mealType.toLowerCase().includes('stew')) {
    return [
      ...baseCooking,
      'Add chopped onions and garlic, sauté until fragrant.',
      'Pour in broth or water, bring to a gentle boil.',
      'Reduce heat and simmer until the meat is tender and cooked through.',
      'Add vegetables and continue simmering until everything is tender.'
    ];
  } else if (cuisine.toLowerCase().includes('asian')) {
    return [
      ...baseCooking,
      'Add minced garlic and ginger, stir-fry for 30 seconds.',
      'Add vegetables and stir-fry for 3-4 minutes until crisp-tender.',
      'Add sauce and toss everything together for 1-2 minutes.'
    ];
  } else {
    return [
      ...baseCooking,
      'Add chopped onions and cook until translucent.',
      'Add garlic and cook for 1 minute until fragrant.',
      'Add any vegetables and cook for 5-7 minutes until tender.',
      'Season with herbs and spices to taste.'
    ];
  }
}

function generateFinishingSteps(mainFood: string, cuisine: string, mealType: string): string[] {
  const baseFinishing = [
    'Taste and adjust seasoning as needed.',
    'Let the dish rest for 2-3 minutes before serving.'
  ];
  
  if (cuisine.toLowerCase().includes('italian')) {
    return [
      ...baseFinishing,
      'Garnish with fresh basil or parsley before serving.',
      'Serve with a side of pasta or crusty bread.'
    ];
  } else if (cuisine.toLowerCase().includes('asian')) {
    return [
      ...baseFinishing,
      'Garnish with green onions and sesame seeds.',
      'Serve over rice or noodles.'
    ];
  } else {
    return [
      ...baseFinishing,
      'Garnish with fresh herbs if desired.',
      'Serve hot and enjoy your ViralCarrot creation! 🍴'
    ];
  }
}

// Smart ingredient generation
function generateSmartIngredients(apiIngredients: string[], userIngredients: string[], mainFood: string): string[] {
  const combined = new Set<string>();
  
  // Add main food
  combined.add(`1 lb ${mainFood}`);
  
  // Add API ingredients (cleaned)
  apiIngredients.forEach(ing => {
    if (ing.trim() && !ing.toLowerCase().includes(mainFood.toLowerCase())) {
      combined.add(ing.trim());
    }
  });
  
  // Add user ingredients
  userIngredients.forEach(ing => {
    if (ing.trim()) {
      combined.add(`1 cup ${ing.trim()}`);
    }
  });
  
  // Add common ingredients
  const commonIngredients = [
    '2 tablespoons olive oil',
    '1 medium onion, diced',
    '2 cloves garlic, minced',
    'Salt and pepper to taste',
    '1 teaspoon herbs (optional)'
  ];
  
  commonIngredients.forEach(ing => combined.add(ing));
  
  return Array.from(combined).slice(0, 12);
}

// Smart title enhancement
function enhanceRecipeTitle(originalTitle: string, mainFood: string): string {
  if (originalTitle.toLowerCase().includes(mainFood.toLowerCase())) {
    return originalTitle;
  }
  
  const enhancedTitles = [
    `ViralCarrot's Special ${mainFood} ${originalTitle}`,
    `Ultimate ${mainFood} ${originalTitle}`,
    `Chef's Choice ${mainFood} ${originalTitle}`,
    `Perfect ${mainFood} ${originalTitle}`
  ];
  
  return enhancedTitles[Math.floor(Math.random() * enhancedTitles.length)];
}

// Smart description generation
function generateSmartDescription(title: string, mainFood: string, cuisine: string, mealType: string): string {
  const descriptions = [
    `${title} is a delicious ${cuisine} dish that showcases the natural flavors of ${mainFood}. Perfect for ${mealType.toLowerCase()}, this recipe combines simplicity with authentic taste.`,
    `This ${cuisine} ${mainFood} recipe is a crowd-pleaser that's both easy to make and incredibly flavorful. Ideal for ${mealType.toLowerCase()}, it brings together fresh ingredients and traditional techniques.`,
    `Experience the rich flavors of ${cuisine} cuisine with this amazing ${mainFood} recipe. Perfect for ${mealType.toLowerCase()}, this dish is sure to become a family favorite.`
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

// SEO description generation
function generateSEODescription(title: string, mainFood: string, cuisine: string, mealType: string): string {
  return `${title} - A delicious ${cuisine} ${mainFood} recipe perfect for ${mealType.toLowerCase()}. Learn how to make this authentic dish with step-by-step instructions, ingredients, and cooking tips. Discover the best ${mainFood} recipes on ViralCarrot.`;
}

// Smart tag generation
function generateSmartTags(recipe: ExternalRecipe, mainFood: string, cuisine: string, mealType: string): string[] {
  const tags = [
    mainFood.toLowerCase(),
    'viral-carrot',
    'smart-composer',
    cuisine.toLowerCase(),
    mealType.toLowerCase()
  ];
  
  if (recipe.difficulty) tags.push(recipe.difficulty.toLowerCase());
  if (recipe.dietaryStyle) tags.push(recipe.dietaryStyle.toLowerCase());
  
  return [...new Set(tags)];
}

// Utility functions
function includesMainIngredient(recipe: ExternalRecipe, mainFood: string): boolean {
  const titleMatch = recipe.title.toLowerCase().includes(mainFood.toLowerCase());
  const ingredientMatch = recipe.ingredients.some(ing => 
    ing.toLowerCase().includes(mainFood.toLowerCase())
  );
  return titleMatch || ingredientMatch;
}

function matchUserIngredients(recipe: ExternalRecipe, userIngredients: string[]): boolean {
  if (userIngredients.length === 0) return true;
  
  const matchCount = userIngredients.filter(userIng => 
    recipe.ingredients.some(recipeIng => 
      recipeIng.toLowerCase().includes(userIng.toLowerCase())
    )
  ).length;
  
  return matchCount >= Math.ceil(userIngredients.length * 0.3); // 30% match threshold
}

function matchFilters(recipe: ExternalRecipe, filters: RecipeFilters): boolean {
  if (filters.cuisine && recipe.cuisine && !recipe.cuisine.toLowerCase().includes(filters.cuisine.toLowerCase())) {
    return false;
  }
  if (filters.mealType && recipe.mealType && !recipe.mealType.toLowerCase().includes(filters.mealType.toLowerCase())) {
    return false;
  }
  if (filters.dietaryStyle && recipe.dietaryStyle && !recipe.dietaryStyle.toLowerCase().includes(filters.dietaryStyle.toLowerCase())) {
    return false;
  }
  if (filters.cookingTime) {
    const timeLimit = parseInt(filters.cookingTime);
    if (recipe.cookingTime > timeLimit) return false;
  }
  return true;
}

function calculateRelevanceScore(recipe: ExternalRecipe, mainFood: string, ingredients: string[]): number {
  let score = 5.0;
  
  // Title relevance
  if (recipe.title.toLowerCase().includes(mainFood.toLowerCase())) score += 3.0;
  
  // Ingredient matches
  const ingredientMatches = ingredients.filter(ing => 
    recipe.ingredients.some(recipeIng => 
      recipeIng.toLowerCase().includes(ing.toLowerCase())
    )
  ).length;
  score += (ingredientMatches / Math.max(ingredients.length, 1)) * 2.0;
  
  // Rating bonus
  if (recipe.rating) score += recipe.rating * 0.5;
  
  return Math.min(score, 10.0);
}

// Image selection with Unsplash API
async function getUnsplashImage(mainFood: string, cuisine: string): Promise<string> {
  try {
    const query = `food ${mainFood} ${cuisine}`;
    const response = await axios.get(`${UNSPLASH_BASE}?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
      headers: {
        'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY || 'demo'}` // You'll need to add this to your env
      }
    });
    
    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0].urls.regular;
    }
  } catch (error) {
    console.error('❌ Unsplash image fetch error:', error);
  }
  
  // Fallback to placeholder
  return `https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center`;
}

// Additional utility functions
function determineCuisineFromTitle(title: string): string {
  const cuisines = {
    'italian': ['pasta', 'pizza', 'risotto', 'parmesan', 'basil'],
    'asian': ['stir', 'wok', 'soy', 'ginger', 'sesame'],
    'mexican': ['taco', 'salsa', 'cilantro', 'lime', 'chili'],
    'indian': ['curry', 'masala', 'turmeric', 'cumin', 'coriander'],
    'french': ['sauce', 'butter', 'wine', 'herbs', 'cream']
  };
  
  const lowerTitle = title.toLowerCase();
  for (const [cuisine, keywords] of Object.entries(cuisines)) {
    if (keywords.some(keyword => lowerTitle.includes(keyword))) {
      return cuisine.charAt(0).toUpperCase() + cuisine.slice(1);
    }
  }
  
  return 'International';
}

function determineMealTypeFromTitle(title: string): string {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('soup') || lowerTitle.includes('stew')) return 'Soup';
  if (lowerTitle.includes('salad')) return 'Salad';
  if (lowerTitle.includes('breakfast') || lowerTitle.includes('pancake')) return 'Breakfast';
  if (lowerTitle.includes('dessert') || lowerTitle.includes('cake')) return 'Dessert';
  return 'Dinner';
}

function determineDietaryStyle(ingredients: string[]): string {
  const lowerIngredients = ingredients.map(ing => ing.toLowerCase());
  
  if (lowerIngredients.some(ing => ing.includes('vegan') || ing.includes('tofu'))) return 'Vegan';
  if (lowerIngredients.some(ing => ing.includes('vegetarian') || ing.includes('cheese'))) return 'Vegetarian';
  if (lowerIngredients.some(ing => ing.includes('gluten-free'))) return 'Gluten-Free';
  if (lowerIngredients.some(ing => ing.includes('keto'))) return 'Keto';
  
  return 'Regular';
}

function determineDifficulty(mainFood: string, mealType: string): string {
  if (mealType.toLowerCase().includes('soup') || mealType.toLowerCase().includes('salad')) return 'Easy';
  if (mainFood.toLowerCase().includes('beef') || mainFood.toLowerCase().includes('lamb')) return 'Hard';
  return 'Medium';
}

function estimateCookingTime(mainFood: string, mealType: string): number {
  const baseTime = {
    'chicken': 25,
    'beef': 35,
    'fish': 15,
    'vegetables': 20,
    'pasta': 20
  };
  
  const foodTime = Object.entries(baseTime).find(([food]) => 
    mainFood.toLowerCase().includes(food)
  )?.[1] || 30;
  
  const mealTime = mealType.toLowerCase().includes('soup') ? 15 : 0;
  
  return foodTime + mealTime;
}

function getRandomCuisine(): string {
  const cuisines = ['Italian', 'Asian', 'Mexican', 'Indian', 'Mediterranean', 'American'];
  return cuisines[Math.floor(Math.random() * cuisines.length)];
}

function getRandomMealType(): string {
  const mealTypes = ['Dinner', 'Lunch', 'Breakfast', 'Soup', 'Salad'];
  return mealTypes[Math.floor(Math.random() * mealTypes.length)];
}

function generateCreativeTitle(mainFood: string, cuisine: string, mealType: string): string {
  const templates = [
    `ViralCarrot's Signature ${mainFood} ${cuisine} ${mealType}`,
    `Chef's Special ${mainFood} ${cuisine} Creation`,
    `Ultimate ${mainFood} ${cuisine} Experience`,
    `Perfect ${mainFood} ${cuisine} ${mealType}`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

// Keep existing utility functions
function extractCookingTime(text: string): number {
  const timeMatch = text.match(/(\d+)\s*(?:min|minutes|hrs|hours)/i);
  if (timeMatch) {
    const time = parseInt(timeMatch[1]);
    return text.toLowerCase().includes('hr') ? time * 60 : time;
  }
  return 30;
}

function extractRating(text: string): number {
  const ratingMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:star|stars|\/5)/i);
  return ratingMatch ? parseFloat(ratingMatch[1]) : 4.0;
}

function removeDuplicateRecipes(recipes: ExternalRecipe[]): ExternalRecipe[] {
  const seen = new Set<string>();
  return recipes.filter(recipe => {
    const key = recipe.title.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function createEnhancedMealDBRecipe(meal: MealDBRecipe): ExternalRecipe {
  const ingredients: string[] = [];
  
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
    servings: 4,
    description: `A traditional ${meal.strArea || 'International'} recipe from TheMealDB`
  };
}

async function fetchNutritionData(mainFood: string): Promise<NutritionData> {
  try {
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
