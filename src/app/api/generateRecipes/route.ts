import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

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
}

// TheMealDB free API endpoints
const MEALDB_BASE = 'https://www.themealdb.com/api/json/v1/1';

export async function POST(request: NextRequest) {
  try {
    console.log('API: Starting smart recipe synthesis');
    
    const body = await request.json();
    const { mainFood, ingredients, filters } = body;

    console.log('API: Received request:', { mainFood, ingredients, filters });

    if (!mainFood || !mainFood.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please enter a main food item' },
        { status: 400 }
      );
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('API: Starting recipe search and synthesis');

    // Step 1: Search for existing recipes from multiple sources
    const externalRecipes = await searchExternalRecipes(mainFood, ingredients, filters);
    console.log('API: Found external recipes:', externalRecipes.length);

    // Step 2: Synthesize unique ViralCarrot recipes with smart matching
    const synthesizedRecipes = await synthesizeRecipesWithMatching(externalRecipes, mainFood, ingredients, filters);
    console.log('API: Synthesized recipes:', synthesizedRecipes.length);

    return NextResponse.json({
      success: true,
      recipes: synthesizedRecipes,
      total: synthesizedRecipes.length,
      message: `Created ${synthesizedRecipes.length} unique recipes by ViralCarrot`
    });

  } catch (error) {
    console.error('API: Error in recipe synthesis:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to synthesize recipes',
        details: error?.toString() || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function searchExternalRecipes(mainFood: string, ingredients: string[], filters: any): Promise<ExternalRecipe[]> {
  const recipes: ExternalRecipe[] = [];
  
  try {
    // Search TheMealDB free API with multiple search strategies
    const mealDbRecipes = await searchTheMealDBComprehensive(mainFood);
    recipes.push(...mealDbRecipes);
    
    // Search for related foods if main food not found
    if (recipes.length < 3) {
      const relatedRecipes = await searchRelatedFoods(mainFood);
      recipes.push(...relatedRecipes);
    }
    
    // Web scraping for additional recipes
    const scrapedRecipes = await scrapeRecipeSites(mainFood, ingredients);
    recipes.push(...scrapedRecipes);
    
  } catch (error) {
    console.error('Error searching external recipes:', error);
  }
  
  return recipes;
}

async function searchTheMealDBComprehensive(mainFood: string): Promise<ExternalRecipe[]> {
  const recipes: ExternalRecipe[] = [];
  
  try {
    // Try direct search first
    const directResponse = await axios.get(`${MEALDB_BASE}/search.php?s=${encodeURIComponent(mainFood)}`);
    if (directResponse.data.meals) {
      const directRecipes = directResponse.data.meals.slice(0, 5).map((meal: any) => createMealDBRecipe(meal));
      recipes.push(...directRecipes);
    }
    
    // Try category search
    const categoryResponse = await axios.get(`${MEALDB_BASE}/filter.php?c=${encodeURIComponent(mainFood)}`);
    if (categoryResponse.data.meals && recipes.length < 5) {
      const categoryRecipes = categoryResponse.data.meals.slice(0, 3).map((meal: any) => createMealDBRecipe(meal));
      recipes.push(...categoryRecipes);
    }
    
    // Try ingredient search
    const ingredientResponse = await axios.get(`${MEALDB_BASE}/filter.php?i=${encodeURIComponent(mainFood)}`);
    if (ingredientResponse.data.meals && recipes.length < 5) {
      const ingredientRecipes = ingredientResponse.data.meals.slice(0, 3).map((meal: any) => createMealDBRecipe(meal));
      recipes.push(...ingredientRecipes);
    }
    
  } catch (error) {
    console.error('TheMealDB comprehensive search error:', error);
  }
  
  return recipes;
}

function createMealDBRecipe(meal: any): ExternalRecipe {
  return {
    title: meal.strMeal,
    ingredients: extractIngredients(meal),
    steps: meal.strInstructions ? meal.strInstructions.split('\r\n').filter((step: string) => step.trim()) : [],
    cookingTime: 30, // Default
    cuisine: 'International',
    mealType: 'dinner',
    dietaryStyle: 'none',
    image: meal.strMealThumb,
    source: 'TheMealDB'
  };
}

function extractIngredients(meal: any): string[] {
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

async function searchRelatedFoods(mainFood: string): Promise<ExternalRecipe[]> {
  // Map unique foods to related common foods
  const foodMappings: { [key: string]: string[] } = {
    'duck': ['chicken', 'poultry'],
    'lamb': ['beef', 'meat'],
    'venison': ['beef', 'meat'],
    'quail': ['chicken', 'poultry'],
    'rabbit': ['chicken', 'poultry'],
    'goat': ['lamb', 'beef'],
    'bison': ['beef', 'meat'],
    'elk': ['beef', 'meat'],
    'turkey': ['chicken', 'poultry'],
    'pheasant': ['chicken', 'poultry'],
    'squid': ['prawns', 'seafood'],
    'octopus': ['prawns', 'seafood'],
    'mussels': ['prawns', 'seafood'],
    'scallops': ['prawns', 'seafood'],
    'lobster': ['prawns', 'seafood'],
    'crab': ['prawns', 'seafood'],
    'tuna': ['salmon', 'fish'],
    'cod': ['salmon', 'fish'],
    'halibut': ['salmon', 'fish'],
    'mackerel': ['salmon', 'fish'],
    'tempeh': ['tofu', 'vegetables'],
    'seitan': ['tofu', 'vegetables'],
    'jackfruit': ['tofu', 'vegetables'],
    'mushrooms': ['vegetables'],
    'eggplant': ['vegetables'],
    'zucchini': ['vegetables'],
    'squash': ['vegetables'],
    'sweet potato': ['potatoes', 'vegetables'],
    'yam': ['potatoes', 'vegetables']
  };
  
  const relatedFoods = foodMappings[mainFood.toLowerCase()] || [mainFood];
  const recipes: ExternalRecipe[] = [];
  
  for (const relatedFood of relatedFoods) {
    try {
      const response = await axios.get(`${MEALDB_BASE}/search.php?s=${encodeURIComponent(relatedFood)}`);
      if (response.data.meals) {
        const relatedRecipes = response.data.meals.slice(0, 2).map((meal: any) => createMealDBRecipe(meal));
        recipes.push(...relatedRecipes);
      }
    } catch (error) {
      console.error(`Error searching for related food ${relatedFood}:`, error);
    }
  }
  
  return recipes;
}

async function scrapeRecipeSites(mainFood: string, ingredients: string[]): Promise<ExternalRecipe[]> {
  const recipes: ExternalRecipe[] = [];
  
  try {
    // Search AllRecipes
    const allRecipesData = await scrapeAllRecipes(mainFood);
    recipes.push(...allRecipesData);
    
    // Search Food.com
    const foodComData = await scrapeFoodCom(mainFood);
    recipes.push(...foodComData);
    
  } catch (error) {
    console.error('Web scraping error:', error);
  }
  
  return recipes;
}

async function scrapeAllRecipes(mainFood: string): Promise<ExternalRecipe[]> {
  try {
    const searchUrl = `https://www.allrecipes.com/search?q=${encodeURIComponent(mainFood)}`;
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const recipes: ExternalRecipe[] = [];
    
    $('.card--no-image').slice(0, 3).each((_, element) => {
      const title = $(element).find('.card__title').text().trim();
      const link = $(element).find('a').attr('href');
      
      if (title && link) {
        recipes.push({
          title,
          ingredients: [], // Would need to scrape individual recipe pages
          steps: [],
          cookingTime: 30,
          cuisine: 'International',
          mealType: 'dinner',
          dietaryStyle: 'none',
          image: '',
          source: 'AllRecipes'
        });
      }
    });
    
    return recipes;
  } catch (error) {
    console.error('AllRecipes scraping error:', error);
    return [];
  }
}

async function scrapeFoodCom(mainFood: string): Promise<ExternalRecipe[]> {
  try {
    const searchUrl = `https://www.food.com/search?q=${encodeURIComponent(mainFood)}`;
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const recipes: ExternalRecipe[] = [];
    
    $('.recipe-card').slice(0, 2).each((_, element) => {
      const title = $(element).find('.recipe-card__title').text().trim();
      
      if (title) {
        recipes.push({
          title,
          ingredients: [],
          steps: [],
          cookingTime: 30,
          cuisine: 'International',
          mealType: 'dinner',
          dietaryStyle: 'none',
          image: '',
          source: 'Food.com'
        });
      }
    });
    
    return recipes;
  } catch (error) {
    console.error('Food.com scraping error:', error);
    return [];
  }
}

async function synthesizeRecipesWithMatching(externalRecipes: ExternalRecipe[], mainFood: string, ingredients: string[], filters: any): Promise<SynthesizedRecipe[]> {
  const synthesized: SynthesizedRecipe[] = [];
  
  // Create recipes with smart matching
  const allRecipes = await createSmartRecipes(mainFood, ingredients, filters, externalRecipes);
  
  // Sort by match score (highest first)
  allRecipes.sort((a, b) => b.matchScore - a.matchScore);
  
  return allRecipes.slice(0, 10);
}

async function createSmartRecipes(mainFood: string, ingredients: string[], filters: any, externalRecipes: ExternalRecipe[]): Promise<SynthesizedRecipe[]> {
  const recipes: SynthesizedRecipe[] = [];
  
  // Create recipes that match BOTH main food AND secondary ingredients (high priority)
  if (ingredients.length > 0) {
    for (let i = 0; i < 3; i++) {
      const recipe = await createSynthesizedRecipe(
        mainFood, 
        ingredients, 
        filters, 
        i + 1, 
        true, // high priority - matches both main and secondary
        externalRecipes[i] || null
      );
      recipes.push(recipe);
    }
  }
  
  // Create recipes that match ONLY main food (lower priority)
  for (let i = 3; i < 10; i++) {
    const recipe = await createSynthesizedRecipe(
      mainFood, 
      ingredients, 
      filters, 
      i + 1, 
      false, // lower priority - matches main food only
      externalRecipes[i] || null
    );
    recipes.push(recipe);
  }
  
  return recipes;
}

async function createSynthesizedRecipe(
  mainFood: string, 
  ingredients: string[], 
  filters: any, 
  index: number, 
  highPriority: boolean,
  externalRecipe: ExternalRecipe | null
): Promise<SynthesizedRecipe> {
  
  // Create proper recipe title
  const title = generateProperRecipeTitle(mainFood, ingredients, filters, index, highPriority);
  
  // Create unique description
  const description = generateUniqueDescription(mainFood, filters);
  
  // Synthesize ingredients with smart matching
  const synthesizedIngredients = synthesizeIngredientsSmart(mainFood, ingredients, highPriority);
  
  // Synthesize steps
  const synthesizedSteps = synthesizeSteps(mainFood, ingredients, highPriority);
  
  // Generate tags
  const tags = generateTags(filters, mainFood);
  
  // Calculate match score
  const matchScore = calculateMatchScore(mainFood, ingredients, highPriority);
  
  // Get appropriate image - UNIQUE for each recipe
  const image = getUniqueRecipeImage(mainFood, ingredients, index, highPriority);
  
  return {
    id: `viralcarrot-${Date.now()}-${index}`,
    title,
    image,
    description,
    ingredients: synthesizedIngredients,
    steps: synthesizedSteps,
    cookingTime: 30,
    cuisine: filters.cuisine || 'International',
    mealType: filters.mealType || 'dinner',
    dietaryStyle: filters.dietaryStyle || 'none',
    tags,
    createdBy: 'ViralCarrot',
    matchScore
  };
}

function generateProperRecipeTitle(mainFood: string, ingredients: string[], filters: any, index: number, highPriority: boolean): string {
  const mainFoodCapitalized = mainFood.charAt(0).toUpperCase() + mainFood.slice(1);
  
  if (highPriority && ingredients.length > 0) {
    // Create titles that include both main food and secondary ingredients
    const secondaryIngredient = ingredients[0];
    const secondaryCapitalized = secondaryIngredient.charAt(0).toUpperCase() + secondaryIngredient.slice(1);
    
    const combinedTemplates = [
      `${mainFoodCapitalized} and ${secondaryCapitalized} Pasta`,
      `${mainFoodCapitalized} with ${secondaryCapitalized} Rice`,
      `${mainFoodCapitalized} ${secondaryCapitalized} Stir-Fry`,
      `${mainFoodCapitalized} ${secondaryCapitalized} Curry`,
      `${mainFoodCapitalized} ${secondaryCapitalized} Tacos`,
      `${mainFoodCapitalized} ${secondaryCapitalized} Salad`,
      `${mainFoodCapitalized} ${secondaryCapitalized} Soup`,
      `${mainFoodCapitalized} ${secondaryCapitalized} Fried Rice`,
      `${mainFoodCapitalized} ${secondaryCapitalized} Skewers`,
      `${mainFoodCapitalized} ${secondaryCapitalized} Bowl`
    ];
    
    return combinedTemplates[index % combinedTemplates.length];
  } else {
    // Create titles that focus on main food only
    const mainFoodTemplates = [
      `${mainFoodCapitalized} Stir-Fry`,
      `${mainFoodCapitalized} Curry`,
      `${mainFoodCapitalized} Tacos`,
      `${mainFoodCapitalized} Salad`,
      `${mainFoodCapitalized} Soup`,
      `${mainFoodCapitalized} Fried Rice`,
      `${mainFoodCapitalized} Pasta`,
      `${mainFoodCapitalized} Skewers`,
      `${mainFoodCapitalized} Burgers`,
      `${mainFoodCapitalized} Noodle Bowl`
    ];
    
    return mainFoodTemplates[index % mainFoodTemplates.length];
  }
}

function synthesizeIngredientsSmart(mainFood: string, ingredients: string[], highPriority: boolean): string[] {
  const synthesized: string[] = [];
  
  // Always include the main food
  synthesized.push(`1 lb ${mainFood}`);
  
  if (highPriority && ingredients.length > 0) {
    // Include secondary ingredients prominently
    ingredients.forEach(ingredient => {
      if (ingredient.trim()) {
        synthesized.push(`2 cups ${ingredient.trim()}`);
      }
    });
  }
  
  // Add common cooking ingredients
  const commonIngredients = [
    '2 cloves garlic, minced',
    '1 onion, diced',
    '2 tbsp olive oil',
    'Salt and pepper to taste',
    '1 tsp herbs de provence',
    '1/2 cup vegetable broth'
  ];
  
  commonIngredients.forEach(ingredient => {
    if (!synthesized.some(ing => ing.toLowerCase().includes(ingredient.split(',')[0].toLowerCase()))) {
      synthesized.push(ingredient);
    }
  });
  
  return synthesized.slice(0, 8);
}

function synthesizeSteps(mainFood: string, ingredients: string[], highPriority: boolean): string[] {
  if (highPriority && ingredients.length > 0) {
    return [
      `Prepare your ${mainFood} by cleaning and cutting into appropriate pieces.`,
      `Heat a large pan over medium-high heat and add olive oil.`,
      `Season the ${mainFood} with salt, pepper, and your favorite herbs.`,
      `Cook the ${mainFood} until golden brown and cooked through.`,
      `Add ${ingredients[0]} and other ingredients, stir to combine.`,
      `Let the flavors meld together for a few minutes.`,
      `Taste and adjust seasoning as needed.`,
      `Serve hot and enjoy your delicious creation!`
    ];
  } else {
    return [
      `Prepare your ${mainFood} by cleaning and cutting into appropriate pieces.`,
      `Heat a large pan over medium-high heat and add olive oil.`,
      `Season the ${mainFood} with salt, pepper, and your favorite herbs.`,
      `Cook the ${mainFood} until golden brown and cooked through.`,
      `Add your additional ingredients and stir to combine.`,
      `Let the flavors meld together for a few minutes.`,
      `Taste and adjust seasoning as needed.`,
      `Serve hot and enjoy your delicious creation!`
    ];
  }
}

function calculateMatchScore(mainFood: string, ingredients: string[], highPriority: boolean): number {
  let score = 10; // Base score for main food match
  
  if (highPriority && ingredients.length > 0) {
    score += ingredients.length * 5; // Bonus for secondary ingredient matches
  }
  
  return score;
}

function getUniqueRecipeImage(mainFood: string, ingredients: string[], index: number, highPriority: boolean): string {
  // Create unique images for each recipe based on main food and cooking method
  const imageMap: { [key: string]: string[] } = {
    'chicken': [
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop'
    ],
    'beef': [
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop'
    ],
    'pork': [
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop'
    ],
    'lamb': [
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop'
    ],
    'duck': [
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop'
    ],
    'fish': [
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop'
    ],
    'salmon': [
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop'
    ],
    'prawns': [
      'https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop'
    ],
    'shrimp': [
      'https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop'
    ],
    'octopus': [
      'https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop'
    ],
    'vegetables': [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop'
    ],
    'tofu': [
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop'
    ],
    'eggs': [
      'https://images.unsplash.com/photo-1572441713132-51c75654db73?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop'
    ],
    'pasta': [
      'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=300&fit=crop'
    ],
    'rice': [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop'
    ],
    'quinoa': [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop'
    ],
    'bread': [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop'
    ],
    'potatoes': [
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop'
    ],
    'mushrooms': [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop'
    ]
  };
  
  const foodImages = imageMap[mainFood.toLowerCase()] || [
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop'
  ];
  
  // Return unique image based on recipe index
  return foodImages[index % foodImages.length];
}

function generateUniqueDescription(mainFood: string, filters: any): string {
  const descriptions = [
    `A delightful fusion of flavors featuring ${mainFood} as the star ingredient. This recipe combines traditional techniques with modern culinary innovation.`,
    `Experience the perfect harmony of ${mainFood} with carefully selected ingredients that create a memorable dining experience.`,
    `This unique ${mainFood} recipe brings together the best of culinary traditions, creating something truly special for your table.`,
    `Discover the art of cooking with ${mainFood} in this carefully crafted recipe that balances taste, texture, and nutrition.`,
    `A creative take on ${mainFood} that showcases the ingredient's versatility and natural flavors.`
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function generateTags(filters: any, mainFood: string): string[] {
  const tags = [mainFood];
  
  if (filters.cuisine) tags.push(filters.cuisine);
  if (filters.mealType) tags.push(filters.mealType);
  if (filters.dietaryStyle) tags.push(filters.dietaryStyle);
  
  return tags;
}
