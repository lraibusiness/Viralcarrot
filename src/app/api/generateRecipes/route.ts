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

// Enhanced API endpoints
const MEALDB_BASE = 'https://www.themealdb.com/api/json/v1/1';
const RECIPE_PUPPY_BASE = 'http://www.recipepuppy.com/api';
const UNSPLASH_BASE = 'https://api.unsplash.com/search/photos';

// LLM-like natural language processing templates
const COOKING_TIPS = [
  "💡 Pro tip: Use fresh herbs for the best flavor",
  "🔥 Chef's secret: Let the meat rest before slicing",
  "⏰ Timing tip: Prep all ingredients before cooking",
  "🌶️ Flavor boost: Toast spices for enhanced aroma",
  "🥄 Technique: Taste and adjust seasoning throughout",
  "🔥 Heat control: Don't rush the cooking process",
  "🧄 Fresh is best: Use fresh garlic and ginger",
  "🍋 Brighten up: A squeeze of lemon adds freshness",
  "🧂 Season smart: Salt in layers for better flavor",
  "🔥 Perfect sear: Don't move the food too early"
];

const COOKING_METHODS = [
  "Sauté until golden and fragrant",
  "Simmer gently until tender",
  "Roast until perfectly caramelized",
  "Grill for beautiful char marks",
  "Braise until fork-tender",
  "Stir-fry until crisp-tender",
  "Steam until just cooked through",
  "Pan-sear for a golden crust",
  "Slow-cook until fall-apart tender",
  "Quick-fry for maximum flavor"
];

const FLAVOR_ENHANCERS = [
  "with a splash of wine",
  "seasoned with aromatic herbs",
  "finished with a drizzle of olive oil",
  "garnished with fresh herbs",
  "accented with citrus zest",
  "enhanced with umami-rich ingredients",
  "balanced with a touch of sweetness",
  "brightened with a squeeze of lemon",
  "warmed with aromatic spices",
  "elevated with quality ingredients"
];

const RECIPE_VARIATIONS = [
  "Classic",
  "Gourmet",
  "Rustic",
  "Modern",
  "Traditional",
  "Fusion",
  "Elevated",
  "Artisanal",
  "Signature",
  "Ultimate"
];

export async function POST(request: NextRequest) {
  try {
    console.log('🧠 LLM-Style Recipe Composer: Starting intelligent recipe synthesis');
    
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
    const cacheKey = `llm_recipes_${mainFood}_${JSON.stringify(ingredients)}_${JSON.stringify(filters)}`;
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      console.log('⚡ API: Returning cached result');
      return NextResponse.json(cachedResult);
    }

    console.log('🔍 API: Starting LLM-Style Recipe Generation');

    // Step 1: Fetch multiple recipes from various sources
    const [externalRecipes, nutritionData] = await Promise.all([
      fetchMultipleRecipes(mainFood, ingredients, filters as RecipeFilters),
      fetchNutritionData(mainFood)
    ]);
    
    console.log(`📊 API: Found ${externalRecipes.length} external recipes`);

    // Step 2: LLM-style natural language processing and merging
    const synthesizedRecipes = await processRecipesWithLLM(
      externalRecipes, 
      mainFood, 
      ingredients, 
      filters as RecipeFilters,
      nutritionData
    );
    
    console.log(`🎯 API: Generated ${synthesizedRecipes.length} LLM-style recipes`);

    const result = {
      success: true,
      recipes: synthesizedRecipes,
      total: synthesizedRecipes.length,
      message: `Created ${synthesizedRecipes.length} intelligent recipes by ViralCarrot LLM Composer`,
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
    console.error('❌ API: Error in LLM-Style Recipe Composer:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate intelligent recipes',
        details: process.env.NODE_ENV === 'development' ? (error as Error)?.toString() : 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// Fetch multiple recipes from various sources
async function fetchMultipleRecipes(
  mainFood: string, 
  ingredients: string[], 
  _filters: RecipeFilters
): Promise<ExternalRecipe[]> {
  const recipes: ExternalRecipe[] = [];
  
  try {
    // Run all searches in parallel
    const searchPromises = [
      searchTheMealDB(mainFood, _filters),
      searchRecipePuppy(mainFood, ingredients)
    ];

    const results = await Promise.allSettled(searchPromises);
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        recipes.push(...result.value);
        console.log(`✅ Source ${index + 1} completed: ${result.value.length} recipes`);
      } else {
        console.warn(`⚠️ Source ${index + 1} failed:`, result.reason);
      }
    });

    // Filter and deduplicate
    const filteredRecipes = recipes
      .filter(recipe => includesMainIngredient(recipe, mainFood))
      .filter(recipe => matchUserIngredients(recipe, ingredients))
      .filter(recipe => matchFilters(recipe, _filters))
      .sort((a, b) => calculateRelevanceScore(b, mainFood, ingredients) - calculateRelevanceScore(a, mainFood, ingredients))
      .slice(0, 20); // Get more recipes for better merging

    return removeDuplicateRecipes(filteredRecipes);

  } catch (error) {
    console.error('❌ Error in multi-source recipe fetch:', error);
    return [];
  }
}

// LLM-style natural language processing and recipe generation
async function processRecipesWithLLM(
  externalRecipes: ExternalRecipe[],
  mainFood: string,
  ingredients: string[],
  filters: RecipeFilters,
  nutritionData: NutritionData
): Promise<SynthesizedRecipe[]> {
  const synthesizedRecipes: SynthesizedRecipe[] = [];
  
  // Generate 10 unique recipes using LLM-style processing
  for (let i = 0; i < 10; i++) {
    const recipe = await generateLLMRecipe(
      externalRecipes, 
      mainFood, 
      ingredients, 
      filters, 
      nutritionData, 
      i
    );
    synthesizedRecipes.push(recipe);
  }
  
  return synthesizedRecipes;
}

// Generate a single LLM-style recipe
async function generateLLMRecipe(
  externalRecipes: ExternalRecipe[],
  mainFood: string,
  ingredients: string[],
  filters: RecipeFilters,
  nutritionData: NutritionData,
  index: number
): Promise<SynthesizedRecipe> {
  // Select base recipes for merging (2-3 recipes)
  const baseRecipes = selectBaseRecipes(externalRecipes, index);
  
  // Generate unique title with variation
  const title = generateLLMTitle(mainFood, baseRecipes, index);
  
  // Merge and enhance ingredients
  const mergedIngredients = mergeIngredientsLLM(baseRecipes, mainFood, ingredients);
  
  // Generate intelligent cooking steps
  const cookingSteps = generateLLMSteps(mainFood, baseRecipes, mergedIngredients, index);
  
  // Get appropriate image
  const image = await getUnsplashImage(title, mainFood);
  
  // Determine cuisine and meal type
  const cuisine = determineCuisineLLM(baseRecipes, filters);
  const mealType = determineMealTypeLLM(baseRecipes, filters);
  
  // Generate description
  const description = generateLLMDescription(title, mainFood, cuisine, mealType);
  
  // Calculate cooking time
  const cookingTime = calculateCookingTimeLLM(baseRecipes, mainFood, mealType);
  
  // Generate tags
  const tags = generateLLMTags(mainFood, cuisine, mealType, mergedIngredients);
  
  return {
    id: `viral-llm-${Date.now()}-${index}`,
    title,
    image,
    description,
    ingredients: mergedIngredients,
    steps: cookingSteps,
    cookingTime,
    cuisine,
    mealType,
    dietaryStyle: determineDietaryStyleLLM(mergedIngredients),
    tags,
    createdBy: 'ViralCarrot LLM Chef',
    matchScore: 9.0 + (Math.random() * 0.9), // High match score for LLM recipes
    rating: 4.5 + (Math.random() * 0.4), // High rating
    difficulty: determineDifficultyLLM(mainFood, mealType, cookingSteps.length),
    servings: 4 + Math.floor(Math.random() * 4), // 4-7 servings
    nutrition: nutritionData,
    seoDescription: generateSEODescription(title, mainFood, cuisine, mealType)
  };
}

// Select 2-3 base recipes for merging
function selectBaseRecipes(externalRecipes: ExternalRecipe[], index: number): ExternalRecipe[] {
  if (externalRecipes.length === 0) return [];
  
  const numRecipes = Math.min(3, externalRecipes.length);
  const startIndex = (index * 2) % externalRecipes.length;
  
  const selected = [];
  for (let i = 0; i < numRecipes; i++) {
    const recipeIndex = (startIndex + i) % externalRecipes.length;
    selected.push(externalRecipes[recipeIndex]);
  }
  
  return selected;
}

// Generate unique title with LLM-style variations
function generateLLMTitle(mainFood: string, baseRecipes: ExternalRecipe[], index: number): string {
  const variation = RECIPE_VARIATIONS[index % RECIPE_VARIATIONS.length];
  const method = COOKING_METHODS[index % COOKING_METHODS.length];
  const enhancer = FLAVOR_ENHANCERS[index % FLAVOR_ENHANCERS.length];
  
  const titles = [
    `${variation} ${mainFood} ${method.split(' ')[0]} Recipe`,
    `Chef's ${mainFood} ${method.split(' ')[0]} ${variation}`,
    `${mainFood} ${method.split(' ')[0]} ${enhancer.split(' ')[0]} Delight`,
    `Ultimate ${mainFood} ${method.split(' ')[0]} Experience`,
    `${variation} ${mainFood} ${enhancer.split(' ')[0]} Creation`
  ];
  
  return titles[index % titles.length];
}

// Merge ingredients using LLM-style logic
function mergeIngredientsLLM(baseRecipes: ExternalRecipe[], mainFood: string, userIngredients: string[]): string[] {
  const allIngredients = new Set<string>();
  
  // Add main food
  allIngredients.add(`1 lb ${mainFood}`);
  
  // Merge ingredients from base recipes
  baseRecipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      if (ingredient.trim() && !ingredient.toLowerCase().includes(mainFood.toLowerCase())) {
        allIngredients.add(ingredient.trim());
      }
    });
  });
  
  // Add user ingredients
  userIngredients.forEach(ingredient => {
    if (ingredient.trim()) {
      allIngredients.add(`1 cup ${ingredient.trim()}`);
    }
  });
  
  // Add common cooking ingredients
  const commonIngredients = [
    '2 tablespoons olive oil',
    '1 medium onion, diced',
    '2 cloves garlic, minced',
    'Salt and pepper to taste',
    '1 teaspoon herbs (optional)',
    '2 tablespoons butter',
    '1 tablespoon fresh herbs',
    '1 lemon, juiced'
  ];
  
  commonIngredients.forEach(ingredient => allIngredients.add(ingredient));
  
  return Array.from(allIngredients).slice(0, 15);
}

// Generate intelligent cooking steps with LLM-style processing
function generateLLMSteps(mainFood: string, baseRecipes: ExternalRecipe[], ingredients: string[], index: number): string[] {
  const steps = [];
  
  // Preparation steps
  steps.push(`Wash and prepare the ${mainFood}, trimming any excess fat or unwanted parts.`);
  steps.push('Gather all your ingredients and have them ready for cooking.');
  
  // Add cooking tip
  const tip = COOKING_TIPS[index % COOKING_TIPS.length];
  steps.push(tip);
  
  // Main cooking steps (merged from base recipes)
  const baseSteps = baseRecipes.flatMap(recipe => recipe.steps).filter(step => step.trim());
  
  if (baseSteps.length > 0) {
    // Select and merge the best steps
    const selectedSteps = baseSteps.slice(0, 4);
    selectedSteps.forEach(step => {
      if (step.length > 20) { // Only use substantial steps
        steps.push(step);
      }
    });
  } else {
    // Generate steps if no base steps available
    const method = COOKING_METHODS[index % COOKING_METHODS.length];
    const enhancer = FLAVOR_ENHANCERS[index % FLAVOR_ENHANCERS.length];
    
    steps.push(`Heat oil in a large pan over medium-high heat.`);
    steps.push(`Add the ${mainFood} and ${method.toLowerCase()}.`);
    steps.push(`Add aromatics and ${enhancer.toLowerCase()}.`);
    steps.push('Season with salt and pepper to taste.');
  }
  
  // Finishing steps
  steps.push('Taste and adjust seasoning as needed.');
  steps.push('Let the dish rest for 2-3 minutes before serving.');
  steps.push('Garnish with fresh herbs and serve immediately.');
  
  return steps;
}

// Get Unsplash image based on recipe title
async function getUnsplashImage(title: string, mainFood: string): Promise<string> {
  try {
    const query = `${mainFood} ${title.split(' ').slice(0, 3).join(' ')}`;
    const response = await axios.get(`${UNSPLASH_BASE}?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
      headers: {
        'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY || 'demo'}`
      }
    });
    
    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0].urls.regular;
    }
  } catch (error) {
    console.error('❌ Unsplash image fetch error:', error);
  }
  
  // Fallback to curated images
  const fallbackImages = [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1604503468500-a3c769998f12?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&crop=center'
  ];
  
  return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
}

// LLM-style description generation
function generateLLMDescription(title: string, mainFood: string, cuisine: string, mealType: string): string {
  const descriptions = [
    `${title} is a sophisticated ${cuisine} dish that showcases the natural flavors of ${mainFood}. This ${mealType.toLowerCase()} recipe combines traditional techniques with modern culinary insights for an unforgettable dining experience.`,
    `Experience the rich complexity of ${cuisine} cuisine with this exceptional ${mainFood} recipe. Perfect for ${mealType.toLowerCase()}, this dish brings together premium ingredients and expert cooking methods for a truly memorable meal.`,
    `This ${cuisine} ${mainFood} creation is a testament to culinary artistry, blending authentic flavors with contemporary presentation. Ideal for ${mealType.toLowerCase()}, it promises to delight your taste buds with every bite.`
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

// Determine cuisine using LLM-style logic
function determineCuisineLLM(baseRecipes: ExternalRecipe[], filters: RecipeFilters): string {
  if (filters.cuisine) return filters.cuisine;
  
  const cuisines = baseRecipes.map(r => r.cuisine).filter(Boolean) as string[];
  if (cuisines.length > 0) {
    return cuisines[0];
  }
  
  const cuisineOptions = ['Italian', 'Asian', 'Mediterranean', 'American', 'French', 'Mexican'];
  return cuisineOptions[Math.floor(Math.random() * cuisineOptions.length)];
}

// Determine meal type using LLM-style logic
function determineMealTypeLLM(baseRecipes: ExternalRecipe[], filters: RecipeFilters): string {
  if (filters.mealType) return filters.mealType;
  
  const mealTypes = baseRecipes.map(r => r.mealType).filter(Boolean) as string[];
  if (mealTypes.length > 0) {
    return mealTypes[0];
  }
  
  const mealTypeOptions = ['Dinner', 'Lunch', 'Breakfast', 'Brunch'];
  return mealTypeOptions[Math.floor(Math.random() * mealTypeOptions.length)];
}

// Calculate cooking time using LLM-style logic
function calculateCookingTimeLLM(baseRecipes: ExternalRecipe[], mainFood: string, mealType: string): number {
  const baseTimes = baseRecipes.map(r => r.cookingTime).filter(t => t > 0);
  if (baseTimes.length > 0) {
    const avgTime = baseTimes.reduce((a, b) => a + b, 0) / baseTimes.length;
    return Math.round(avgTime);
  }
  
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
  
  return foodTime + (mealType.toLowerCase().includes('soup') ? 15 : 0);
}

// Generate LLM-style tags
function generateLLMTags(mainFood: string, cuisine: string, mealType: string, ingredients: string[]): string[] {
  const tags = [
    mainFood.toLowerCase(),
    'viral-carrot',
    'llm-generated',
    cuisine.toLowerCase(),
    mealType.toLowerCase()
  ];
  
  // Add ingredient-based tags
  ingredients.slice(0, 3).forEach(ingredient => {
    const keyIngredient = ingredient.split(',')[0].trim().toLowerCase();
    if (keyIngredient.length > 3) {
      tags.push(keyIngredient);
    }
  });
  
  return [...new Set(tags)];
}

// Determine dietary style using LLM logic
function determineDietaryStyleLLM(ingredients: string[]): string {
  const lowerIngredients = ingredients.map(ing => ing.toLowerCase());
  
  if (lowerIngredients.some(ing => ing.includes('vegan') || ing.includes('tofu'))) return 'Vegan';
  if (lowerIngredients.some(ing => ing.includes('vegetarian') || ing.includes('cheese'))) return 'Vegetarian';
  if (lowerIngredients.some(ing => ing.includes('gluten-free'))) return 'Gluten-Free';
  if (lowerIngredients.some(ing => ing.includes('keto'))) return 'Keto';
  
  return 'Regular';
}

// Determine difficulty using LLM logic
function determineDifficultyLLM(mainFood: string, mealType: string, stepCount: number): string {
  if (mealType.toLowerCase().includes('soup') || mealType.toLowerCase().includes('salad')) return 'Easy';
  if (mainFood.toLowerCase().includes('beef') || mainFood.toLowerCase().includes('lamb')) return 'Hard';
  if (stepCount > 8) return 'Hard';
  if (stepCount > 5) return 'Medium';
  return 'Easy';
}

// Generate SEO description
function generateSEODescription(title: string, mainFood: string, cuisine: string, mealType: string): string {
  return `${title} - A delicious ${cuisine} ${mainFood} recipe perfect for ${mealType.toLowerCase()}. Learn how to make this authentic dish with step-by-step instructions, ingredients, and cooking tips. Discover the best ${mainFood} recipes on ViralCarrot.`;
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
  
  return matchCount >= Math.ceil(userIngredients.length * 0.3);
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
  
  if (recipe.title.toLowerCase().includes(mainFood.toLowerCase())) score += 3.0;
  
  const ingredientMatches = ingredients.filter(ing => 
    recipe.ingredients.some(recipeIng => 
      recipeIng.toLowerCase().includes(ing.toLowerCase())
    )
  ).length;
  score += (ingredientMatches / Math.max(ingredients.length, 1)) * 2.0;
  
  if (recipe.rating) score += recipe.rating * 0.5;
  
  return Math.min(score, 10.0);
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

// API search functions
async function searchTheMealDB(mainFood: string, _filters: RecipeFilters): Promise<ExternalRecipe[]> {
  try {
    const response = await axios.get(`${MEALDB_BASE}/search.php?s=${encodeURIComponent(mainFood)}`);
    if (response.data.meals) {
      return response.data.meals.slice(0, 3).map((meal: MealDBRecipe) => ({
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

async function searchRecipePuppy(mainFood: string, ingredients: string[]): Promise<ExternalRecipe[]> {
  try {
    const ingredientQuery = ingredients.length > 0 ? ingredients.join(',') : '';
    const url = `${RECIPE_PUPPY_BASE}/?q=${encodeURIComponent(mainFood)}&i=${encodeURIComponent(ingredientQuery)}`;
    const response = await axios.get(url, { timeout: 5000 });
    
    if (response.data && response.data.results) {
      return response.data.results.slice(0, 3).map((recipe: RecipePuppyRecipe) => ({
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
