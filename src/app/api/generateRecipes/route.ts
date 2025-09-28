import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import NodeCache from 'node-cache';

// Initialize cache with 30 minute TTL
const cache = new NodeCache({ stdTTL: 1800 });

// Image cache to track used images and ensure uniqueness
const imageCache = new NodeCache({ stdTTL: 3600 }); // 1 hour TTL

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
  ingredientMatch?: {
    availableIngredients: string[];
    missingIngredients: string[];
    matchPercentage: number;
  };
  isExternal?: boolean;
  sourceUrl?: string;
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
const UNSPLASH_BASE = 'https://api.unsplash.com/search/photos';

// Comprehensive fallback image pools organized by food type
const FALLBACK_IMAGES = {
  chicken: [
    'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&h=400&fit=crop'
  ],
  beef: [
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1558030006-450675393462?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop'
  ],
  fish: [
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=600&h=400&fit=crop'
  ],
  octopus: [
    'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop'
  ],
  seafood: [
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=600&h=400&fit=crop'
  ],
  pasta: [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&h=400&fit=crop'
  ],
  vegetables: [
    'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=400&fit=crop'
  ],
  rice: [
    'https://images.unsplash.com/photo-1604503468500-a3c769998f12?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&h=400&fit=crop'
  ],
  general: [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1604503468500-a3c769998f12?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&h=400&fit=crop'
  ]
};

export async function POST(request: NextRequest) {
  try {
    console.log('🧠 Enhanced Recipe Composer: Starting intelligent recipe synthesis with external recipes');
    
    const body = await request.json();
    const { mainFood, ingredients = [], filters = {}, includeExternal = true } = body;

    console.log('�� API: Received request:', { mainFood, ingredients, filters, includeExternal });

    if (!mainFood || !mainFood.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please enter a main food item' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `enhanced_recipes_${mainFood}_${JSON.stringify(ingredients)}_${JSON.stringify(filters)}_${includeExternal}`;
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      console.log('⚡ API: Returning cached result');
      return NextResponse.json(cachedResult);
    }

    console.log('🔍 API: Starting Enhanced Recipe Generation with External Recipes');

    // Clear image cache for this session to ensure fresh unique images
    const sessionKey = `images_${mainFood}_${Date.now()}`;
    imageCache.set(sessionKey, new Set());

    // Step 1: Build comprehensive search query
    const searchQuery = buildSearchQuery(mainFood, ingredients, filters as RecipeFilters);
    console.log('🔍 Search Query:', searchQuery);

    // Step 2: Fetch recipes from multiple sources in parallel
    const [apiRecipes, externalRecipes, nutritionData] = await Promise.all([
      fetchAPIRecipes(mainFood, ingredients, filters as RecipeFilters),
      includeExternal ? fetchExternalRecipes(mainFood, ingredients, filters as RecipeFilters) : Promise.resolve([]),
      fetchNutritionData(mainFood)
    ]);
    
    console.log(`📊 API: Found ${apiRecipes.length} API recipes, ${externalRecipes.length} external recipes`);

    // Step 3: If no API recipes found, generate fallback recipes for exotic ingredients
    let allRecipes = apiRecipes;
    if (apiRecipes.length === 0) {
      console.log('🔄 No API recipes found, generating fallback recipes for exotic ingredient');
      allRecipes = generateFallbackRecipes(mainFood, ingredients, filters as RecipeFilters);
    }

    // Step 4: Enhanced recipe processing and synthesis
    const [viralCarrotRecipes, processedExternalRecipes] = await Promise.all([
      processRecipesWithEnhancedLogic(
        allRecipes, 
        mainFood, 
        ingredients, 
        filters as RecipeFilters,
        nutritionData,
        sessionKey
      ),
      processExternalRecipes(externalRecipes, mainFood, ingredients)
    ]);
    
    // Step 5: Combine and rank recipes (ViralCarrot originals first, then external)
    const combinedRecipes = [...viralCarrotRecipes, ...processedExternalRecipes];
    
    console.log(`🎯 API: Generated ${viralCarrotRecipes.length} ViralCarrot recipes, ${processedExternalRecipes.length} external recipes`);

    const result = {
      success: true,
      recipes: combinedRecipes,
      total: combinedRecipes.length,
      viralCarrotCount: viralCarrotRecipes.length,
      externalCount: processedExternalRecipes.length,
      message: `Created ${viralCarrotRecipes.length} ViralCarrot recipes and found ${processedExternalRecipes.length} popular recipes from the web`,
      sources: [...new Set([...allRecipes.map(r => r.source), ...externalRecipes.map(r => r.source)])],
      searchMetadata: {
        mainFood,
        searchQuery,
        ingredientCount: ingredients.length,
        filtersApplied: Object.keys(filters).length,
        apiRecipesFound: apiRecipes.length,
        fallbackRecipesGenerated: allRecipes.length - apiRecipes.length,
        externalRecipesFound: externalRecipes.length,
        totalRecipesFound: combinedRecipes.length
      }
    };

    // Cache the result
    cache.set(cacheKey, result);

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ API: Error in Enhanced Recipe Composer:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate enhanced recipes',
        details: process.env.NODE_ENV === 'development' ? (error as Error)?.toString() : 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// Fetch external recipes
async function fetchExternalRecipes(mainFood: string, ingredients: string[], filters: RecipeFilters): Promise<ExternalRecipe[]> {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/externalRecipes`, {
      mainFood,
      ingredients,
      filters
    });
    
    if (response.data.success) {
      return response.data.recipes || [];
    }
    
    return [];
  } catch (error) {
    console.error('❌ Error fetching external recipes:', error);
    return [];
  }
}

// Process external recipes
async function processExternalRecipes(externalRecipes: ExternalRecipe[], _mainFood: string, _ingredients: string[]): Promise<SynthesizedRecipe[]> {
  return externalRecipes.map(recipe => ({
    id: recipe.id || `external-${Date.now()}`,
    title: recipe.title,
    image: recipe.image || '',
    description: recipe.description || '',
    ingredients: recipe.ingredients,
    steps: recipe.steps,
    cookingTime: recipe.cookingTime,
    cuisine: recipe.cuisine,
    mealType: recipe.mealType,
    dietaryStyle: recipe.dietaryStyle,
    tags: [recipe.cuisine?.toLowerCase(), recipe.mealType?.toLowerCase(), 'external', 'popular'],
    createdBy: recipe.source,
    matchScore: 0.8,
    rating: recipe.rating,
    difficulty: recipe.difficulty,
    servings: recipe.servings,
    nutrition: recipe.nutrition,
    seoDescription: `${recipe.title} - A popular ${recipe.cuisine} recipe from ${recipe.source}`,
    ingredientMatch: {
      availableIngredients: [],
      missingIngredients: [],
      matchPercentage: 85
    },
    isExternal: true,
    sourceUrl: `https://${recipe.source.toLowerCase()}.com`
  }));
}

// Build comprehensive search query using all selected fields
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
  
  // Add cooking time context
  if (filters.cookingTime) {
    const timeContext = getTimeContext(filters.cookingTime);
    if (timeContext) {
      query += ` ${timeContext}`;
    }
  }
  
  return query.trim();
}

function getTimeContext(cookingTime: string): string {
  const timeMap: { [key: string]: string } = {
    '15': 'quick easy',
    '30': 'easy',
    '60': 'simple',
    '120': 'traditional',
    '240': 'slow cooked'
  };
  return timeMap[cookingTime] || '';
}

// Fetch recipes from API sources
async function fetchAPIRecipes(mainFood: string, ingredients: string[], filters: RecipeFilters): Promise<ExternalRecipe[]> {
  const recipes: ExternalRecipe[] = [];
  
  try {
    // Run API searches in parallel
    const searchPromises = [
      searchTheMealDB(mainFood, filters),
      searchRecipePuppy(mainFood, ingredients)
    ];

    const results = await Promise.allSettled(searchPromises);
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        recipes.push(...result.value);
        console.log(`✅ API Source ${index + 1} completed: ${result.value.length} recipes`);
      } else {
        console.warn(`⚠️ API Source ${index + 1} failed:`, result.reason);
      }
    });

    return recipes;

  } catch (error) {
    console.error('❌ Error in API recipe fetch:', error);
    return [];
  }
}

// Generate fallback recipes for exotic ingredients
function generateFallbackRecipes(mainFood: string, ingredients: string[], filters: RecipeFilters): ExternalRecipe[] {
  const recipes: ExternalRecipe[] = [];
  
  // Generate 3-5 fallback recipes for exotic ingredients
  const recipeTemplates = [
    {
      title: `Traditional ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Recipe`,
      cuisine: 'Mediterranean',
      mealType: 'dinner',
      cookingTime: 45,
      difficulty: 'Medium',
      description: `A traditional Mediterranean ${mainFood} recipe with authentic flavors`
    },
    {
      title: `Grilled ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} with Herbs`,
      cuisine: 'Mediterranean',
      mealType: 'dinner',
      cookingTime: 30,
      difficulty: 'Easy',
      description: `A simple grilled ${mainFood} recipe with fresh herbs and olive oil`
    },
    {
      title: `${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Stew`,
      cuisine: 'International',
      mealType: 'dinner',
      cookingTime: 60,
      difficulty: 'Medium',
      description: `A hearty ${mainFood} stew perfect for cold weather`
    },
    {
      title: `Pan-Seared ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)}`,
      cuisine: 'International',
      mealType: 'dinner',
      cookingTime: 25,
      difficulty: 'Easy',
      description: `Quick and easy pan-seared ${mainFood} with simple seasonings`
    },
    {
      title: `${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} with Garlic and Lemon`,
      cuisine: 'Mediterranean',
      mealType: 'dinner',
      cookingTime: 35,
      difficulty: 'Easy',
      description: `A flavorful ${mainFood} recipe with garlic, lemon, and fresh herbs`
    }
  ];

  recipeTemplates.forEach((template, index) => {
    const recipe: ExternalRecipe = {
      title: template.title,
      ingredients: generateFallbackIngredients(mainFood, ingredients),
      steps: generateFallbackSteps(mainFood, template.cookingTime),
      cookingTime: template.cookingTime,
      cuisine: template.cuisine,
      mealType: template.mealType,
      image: '',
      source: 'ViralCarrot Fallback',
      rating: 4.0 + (Math.random() * 1.0),
      difficulty: template.difficulty,
      servings: 4,
      description: template.description
    };
    
    recipes.push(recipe);
  });

  return recipes;
}

// Generate fallback ingredients
function generateFallbackIngredients(mainFood: string, userIngredients: string[]): string[] {
  const baseIngredients = [mainFood];
  
  // Add user ingredients
  userIngredients.forEach(ingredient => {
    if (ingredient.trim()) {
      baseIngredients.push(ingredient.trim());
    }
  });
  
  // Add common ingredients based on food type
  if (mainFood.toLowerCase().includes('octopus') || mainFood.toLowerCase().includes('seafood')) {
    baseIngredients.push('olive oil', 'garlic', 'lemon', 'salt', 'black pepper', 'fresh herbs');
  } else if (mainFood.toLowerCase().includes('chicken')) {
    baseIngredients.push('olive oil', 'garlic', 'onions', 'salt', 'black pepper', 'herbs');
  } else if (mainFood.toLowerCase().includes('beef')) {
    baseIngredients.push('olive oil', 'garlic', 'onions', 'salt', 'black pepper', 'thyme');
  } else {
    baseIngredients.push('olive oil', 'garlic', 'salt', 'black pepper', 'herbs');
  }
  
  return baseIngredients;
}

// Generate fallback steps
function generateFallbackSteps(mainFood: string, cookingTime: number): string[] {
  const steps: string[] = [];
  
  // Preparation step
  steps.push(`Clean and prepare the ${mainFood} according to your preference.`);
  
  // Seasoning step
  steps.push(`Season the ${mainFood} with salt, pepper, and your favorite herbs.`);
  
  // Cooking method based on food type
  if (mainFood.toLowerCase().includes('octopus') || mainFood.toLowerCase().includes('seafood')) {
    steps.push(`Heat olive oil in a large pan over medium-high heat.`);
    steps.push(`Cook the ${mainFood} for 3-4 minutes per side until golden brown.`);
    steps.push(`Add garlic and lemon juice, cook for another 2-3 minutes.`);
  } else if (mainFood.toLowerCase().includes('chicken')) {
    steps.push(`Heat oil in a large skillet over medium-high heat.`);
    steps.push(`Cook the ${mainFood} for 6-8 minutes per side until golden and cooked through.`);
  } else {
    steps.push(`Heat oil in a large pan over medium heat.`);
    steps.push(`Cook the ${mainFood} until tender, about ${Math.floor(cookingTime * 0.6)} minutes.`);
  }
  
  // Finishing steps
  steps.push(`Taste and adjust seasoning as needed.`);
  steps.push(`Serve hot and enjoy your delicious ${mainFood} creation!`);
  
  return steps;
}

// Enhanced recipe processing with better logic
async function processRecipesWithEnhancedLogic(
  externalRecipes: ExternalRecipe[],
  mainFood: string,
  ingredients: string[],
  filters: RecipeFilters,
  nutritionData: NutritionData,
  sessionKey: string
): Promise<SynthesizedRecipe[]> {
  const synthesizedRecipes: SynthesizedRecipe[] = [];
  
  // Filter and sort recipes by relevance
  const relevantRecipes = externalRecipes
    .filter(recipe => includesMainIngredient(recipe, mainFood))
    .filter(recipe => matchUserIngredients(recipe, ingredients))
    .filter(recipe => matchFilters(recipe, filters))
    .sort((a, b) => calculateRelevanceScore(b, mainFood, ingredients) - calculateRelevanceScore(a, mainFood, ingredients));

  console.log(`📊 Filtered to ${relevantRecipes.length} relevant recipes`);

  // Generate up to 6 unique recipes
  const maxRecipes = Math.min(6, relevantRecipes.length);
  
  for (let i = 0; i < maxRecipes; i++) {
    const recipe = await generateEnhancedRecipe(
      relevantRecipes, 
      mainFood, 
      ingredients, 
      filters, 
      nutritionData, 
      i,
      sessionKey
    );
    synthesizedRecipes.push(recipe);
  }
  
  return synthesizedRecipes;
}

// Generate enhanced recipe with better logic
async function generateEnhancedRecipe(
  relevantRecipes: ExternalRecipe[],
  mainFood: string,
  ingredients: string[],
  filters: RecipeFilters,
  nutritionData: NutritionData,
  index: number,
  sessionKey: string
): Promise<SynthesizedRecipe> {
  // Select base recipes for merging (2-3 recipes)
  const baseRecipes = selectBaseRecipes(relevantRecipes, index);
  
  // Generate unique title with variation
  const title = generateEnhancedTitle(mainFood, baseRecipes, index);
  
  // Merge and enhance ingredients
  const mergedIngredients = mergeIngredientsEnhanced(baseRecipes, mainFood, ingredients);
  
  // Generate intelligent cooking steps
  const cookingSteps = generateEnhancedSteps(mainFood, baseRecipes, mergedIngredients, index);
  
  // Determine cuisine and meal type
  const cuisine = determineCuisineEnhanced(baseRecipes, filters);
  const mealType = determineMealTypeEnhanced(baseRecipes, filters);
  
  // Get appropriate unique image
  const image = await getEnhancedRecipeImage(title, mainFood, cuisine, mealType, index, sessionKey);
  
  // Generate description
  const description = generateEnhancedDescription(title, mainFood, cuisine, mealType);
  
  // Calculate match score
  const matchScore = calculateMatchScore(baseRecipes, mainFood, ingredients);
  
  // Generate tags
  const tags = generateEnhancedTags(mainFood, cuisine, mealType, filters);
  
  return {
    id: `enhanced-${Date.now()}-${index}`,
    title,
    image,
    description,
    ingredients: mergedIngredients,
    steps: cookingSteps,
    cookingTime: calculateCookingTime(baseRecipes, filters),
    cuisine,
    mealType,
    dietaryStyle: filters.dietaryStyle,
    tags,
    createdBy: 'ViralCarrot Enhanced Composer',
    matchScore,
    rating: 4.2 + (Math.random() * 0.8), // 4.2-5.0 rating
    difficulty: determineDifficulty(baseRecipes),
    servings: 4,
    nutrition: {
      calories: nutritionData.calories + Math.floor(Math.random() * 200),
      protein: nutritionData.protein + Math.floor(Math.random() * 20),
      carbs: nutritionData.carbs + Math.floor(Math.random() * 30),
      fat: nutritionData.fat + Math.floor(Math.random() * 15)
    },
    seoDescription: `${title} - A delicious ${cuisine} ${mealType} recipe featuring ${mainFood}. Perfect for any occasion.`,
    ingredientMatch: {
      availableIngredients: ingredients.filter(ing => 
        mergedIngredients.some(recipeIng => 
          recipeIng.toLowerCase().includes(ing.toLowerCase()) ||
          ing.toLowerCase().includes(recipeIng.toLowerCase())
        )
      ),
      missingIngredients: ingredients.filter(ing => 
        !mergedIngredients.some(recipeIng => 
          recipeIng.toLowerCase().includes(ing.toLowerCase()) ||
          ing.toLowerCase().includes(recipeIng.toLowerCase())
        )
      ),
      matchPercentage: Math.round((ingredients.filter(ing => 
        mergedIngredients.some(recipeIng => 
          recipeIng.toLowerCase().includes(ing.toLowerCase()) ||
          ing.toLowerCase().includes(recipeIng.toLowerCase())
        )
      ).length / Math.max(ingredients.length, 1)) * 100)
    },
    isExternal: false
  };
}

// Enhanced title generation
function generateEnhancedTitle(mainFood: string, baseRecipes: ExternalRecipe[], index: number): string {
  const titleVariations = [
    `Delicious ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Recipe`,
    `Perfect ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Dish`,
    `Amazing ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Creation`,
    `Gourmet ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)}`,
    `Chef's ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Special`,
    `Ultimate ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Recipe`
  ];
  
  if (baseRecipes.length > 0) {
    const baseTitle = baseRecipes[0].title;
    const words = baseTitle.split(' ');
    if (words.length > 2) {
      return `${words.slice(0, 2).join(' ')} ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)}`;
    }
  }
  
  return titleVariations[index % titleVariations.length];
}

// Enhanced ingredient merging
function mergeIngredientsEnhanced(baseRecipes: ExternalRecipe[], mainFood: string, userIngredients: string[]): string[] {
  const allIngredients = new Set<string>();
  
  // Add main food
  allIngredients.add(mainFood);
  
  // Add user ingredients
  userIngredients.forEach(ingredient => {
    if (ingredient.trim()) {
      allIngredients.add(ingredient.trim());
    }
  });
  
  // Add ingredients from base recipes
  baseRecipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      if (ingredient.trim()) {
        allIngredients.add(ingredient.trim());
      }
    });
  });
  
  // Convert to array and limit to 12 ingredients
  return Array.from(allIngredients).slice(0, 12);
}

// Enhanced step generation
function generateEnhancedSteps(mainFood: string, baseRecipes: ExternalRecipe[], ingredients: string[], _index: number): string[] {
  const steps: string[] = [];
  
  // Preparation step
  steps.push(`Prepare the ${mainFood} by cleaning and cutting as needed.`);
  
  // Ingredient preparation
  if (ingredients.length > 1) {
    steps.push(`Gather all ingredients: ${ingredients.slice(1, 4).join(', ')}.`);
  }
  
  // Cooking steps based on main food type
  if (mainFood.toLowerCase().includes('octopus') || mainFood.toLowerCase().includes('seafood')) {
    steps.push(`Heat a large pan over medium-high heat and add olive oil.`);
    steps.push(`Cook the ${mainFood} for 3-4 minutes per side until golden brown.`);
    steps.push(`Add garlic, herbs, and seasonings to the pan.`);
    steps.push(`Continue cooking for another 2-3 minutes until fragrant.`);
  } else if (mainFood.toLowerCase().includes('chicken')) {
    steps.push(`Season the ${mainFood} with salt, pepper, and your favorite spices.`);
    steps.push(`Heat oil in a large skillet over medium-high heat.`);
    steps.push(`Cook the ${mainFood} for 6-8 minutes per side until golden and cooked through.`);
  } else {
    steps.push(`Heat oil in a large pan over medium heat.`);
    steps.push(`Add the ${mainFood} and cook until tender, about 10-15 minutes.`);
    steps.push(`Season with salt, pepper, and herbs to taste.`);
  }
  
  // Finishing steps
  steps.push(`Taste and adjust seasoning as needed.`);
  steps.push(`Serve hot and enjoy your delicious ${mainFood} creation!`);
  
  return steps;
}

// Enhanced cuisine determination
function determineCuisineEnhanced(baseRecipes: ExternalRecipe[], filters: RecipeFilters): string {
  if (filters.cuisine) {
    return filters.cuisine.charAt(0).toUpperCase() + filters.cuisine.slice(1);
  }
  
  const cuisines = baseRecipes.map(recipe => recipe.cuisine).filter(Boolean) as string[];
  if (cuisines.length > 0) {
    return cuisines[0];
  }
  
  return 'International';
}

// Enhanced meal type determination
function determineMealTypeEnhanced(baseRecipes: ExternalRecipe[], filters: RecipeFilters): string {
  if (filters.mealType) {
    return filters.mealType.charAt(0).toUpperCase() + filters.mealType.slice(1);
  }
  
  const mealTypes = baseRecipes.map(recipe => recipe.mealType).filter(Boolean) as string[];
  if (mealTypes.length > 0) {
    return mealTypes[0];
  }
  
  return 'Dinner';
}

// Enhanced image selection
async function getEnhancedRecipeImage(title: string, mainFood: string, cuisine: string, mealType: string, index: number, sessionKey: string): Promise<string> {
  const usedImages = imageCache.get(sessionKey) as Set<string> || new Set();
  
  try {
    // Try Unsplash first
    const unsplashQuery = `${mainFood} ${cuisine} ${mealType} recipe food`;
    const response = await axios.get(`${UNSPLASH_BASE}?query=${encodeURIComponent(unsplashQuery)}&per_page=10&orientation=landscape`, {
      headers: {
        'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY || 'demo'}`
      },
      timeout: 5000
    });
    
    if (response.data.results && response.data.results.length > 0) {
      for (const result of response.data.results) {
        const imageUrl = result.urls.regular;
        if (!usedImages.has(imageUrl)) {
          usedImages.add(imageUrl);
          imageCache.set(sessionKey, usedImages);
          return imageUrl;
        }
      }
    }
  } catch (error) {
    console.error('❌ Unsplash image fetch error:', error);
  }
  
  // Fallback to curated images
  const foodType = getFoodType(mainFood);
  const fallbackImages = (FALLBACK_IMAGES as Record<string, string[]>)[foodType] || FALLBACK_IMAGES.general;
  const availableImages = fallbackImages.filter(img => !usedImages.has(img));
  
  if (availableImages.length > 0) {
    const selectedImage = availableImages[index % availableImages.length];
    usedImages.add(selectedImage);
    imageCache.set(sessionKey, usedImages);
    return selectedImage;
  }
  
  // Final fallback
  return FALLBACK_IMAGES.general[index % FALLBACK_IMAGES.general.length];
}

function getFoodType(mainFood: string): string {
  const food = mainFood.toLowerCase();
  if (food.includes('chicken')) return 'chicken';
  if (food.includes('beef') || food.includes('steak')) return 'beef';
  if (food.includes('fish') || food.includes('salmon') || food.includes('tuna')) return 'fish';
  if (food.includes('octopus') || food.includes('squid') || food.includes('shrimp')) return 'seafood';
  if (food.includes('pasta') || food.includes('spaghetti')) return 'pasta';
  if (food.includes('rice')) return 'rice';
  if (food.includes('vegetable') || food.includes('broccoli')) return 'vegetables';
  return 'general';
}

// Enhanced description generation
function generateEnhancedDescription(title: string, mainFood: string, cuisine: string, mealType: string): string {
  return `A delicious ${cuisine} ${mealType} recipe featuring ${mainFood}. This ${title.toLowerCase()} combines fresh ingredients with traditional cooking techniques to create a memorable dining experience. Perfect for any occasion.`;
}

// Enhanced tag generation
function generateEnhancedTags(mainFood: string, cuisine: string, mealType: string, filters: RecipeFilters): string[] {
  const tags = [cuisine.toLowerCase(), mealType.toLowerCase(), 'viralcarrot'];
  
  if (filters.dietaryStyle) {
    tags.push(filters.dietaryStyle.toLowerCase());
  }
  
  if (mainFood.toLowerCase().includes('octopus') || mainFood.toLowerCase().includes('seafood')) {
    tags.push('seafood', 'mediterranean');
  }
  
  return tags;
}

// Helper functions
function selectBaseRecipes(recipes: ExternalRecipe[], index: number): ExternalRecipe[] {
  const startIndex = index * 2;
  return recipes.slice(startIndex, startIndex + 2);
}

function includesMainIngredient(recipe: ExternalRecipe, mainFood: string): boolean {
  const searchText = `${recipe.title} ${recipe.ingredients.join(' ')}`.toLowerCase();
  return searchText.includes(mainFood.toLowerCase());
}

function matchUserIngredients(recipe: ExternalRecipe, userIngredients: string[]): boolean {
  if (userIngredients.length === 0) return true;
  
  const recipeText = `${recipe.title} ${recipe.ingredients.join(' ')}`.toLowerCase();
  return userIngredients.some(ingredient => 
    recipeText.includes(ingredient.toLowerCase())
  );
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
  return true;
}

function calculateRelevanceScore(recipe: ExternalRecipe, mainFood: string, ingredients: string[]): number {
  let score = 0;
  
  // Title match
  if (recipe.title.toLowerCase().includes(mainFood.toLowerCase())) {
    score += 10;
  }
  
  // Ingredient match
  const recipeText = recipe.ingredients.join(' ').toLowerCase();
  if (recipeText.includes(mainFood.toLowerCase())) {
    score += 5;
  }
  
  // User ingredient matches
  ingredients.forEach(ingredient => {
    if (recipeText.includes(ingredient.toLowerCase())) {
      score += 2;
    }
  });
  
  return score;
}

function calculateMatchScore(baseRecipes: ExternalRecipe[], mainFood: string, ingredients: string[]): number {
  if (baseRecipes.length === 0) return 0.5;
  
  let totalScore = 0;
  baseRecipes.forEach(recipe => {
    totalScore += calculateRelevanceScore(recipe, mainFood, ingredients);
  });
  
  return Math.min(totalScore / (baseRecipes.length * 20), 1);
}

function calculateCookingTime(baseRecipes: ExternalRecipe[], filters: RecipeFilters): number {
  if (filters.cookingTime) {
    return parseInt(filters.cookingTime);
  }
  
  if (baseRecipes.length > 0) {
    const avgTime = baseRecipes.reduce((sum, recipe) => sum + recipe.cookingTime, 0) / baseRecipes.length;
    return Math.round(avgTime);
  }
  
  return 30;
}

function determineDifficulty(baseRecipes: ExternalRecipe[]): string {
  if (baseRecipes.length === 0) return 'Medium';
  
  const difficulties = baseRecipes.map(recipe => recipe.difficulty).filter(Boolean) as string[];
  if (difficulties.length > 0) {
    return difficulties[0];
  }
  
  return 'Medium';
}

// API search functions
async function searchTheMealDB(mainFood: string, _filters: RecipeFilters): Promise<ExternalRecipe[]> {
  try {
    const response = await axios.get(`${MEALDB_BASE}/search.php?s=${encodeURIComponent(mainFood)}`);
    if (response.data.meals) {
      return response.data.meals.slice(0, 5).map((meal: MealDBRecipe) => ({
        title: meal.strMeal,
        ingredients: extractMealDBIngredients(meal),
        steps: meal.strInstructions ? meal.strInstructions.split('\n').filter((step: string) => step.trim()) : [],
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

async function searchRecipePuppy(mainFood: string, ingredients: string[]): Promise<ExternalRecipe[]> {
  try {
    const ingredientQuery = ingredients.length > 0 ? ingredients.join(',') : '';
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

async function fetchNutritionData(_mainFood: string): Promise<NutritionData> {
  // Return default nutrition data
  return {
    calories: 200 + Math.floor(Math.random() * 300),
    protein: 15 + Math.floor(Math.random() * 20),
    carbs: 20 + Math.floor(Math.random() * 30),
    fat: 8 + Math.floor(Math.random() * 15)
  };
}
