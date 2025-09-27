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
}

// Free recipe sources to scrape
const RECIPE_SOURCES = [
  'https://www.allrecipes.com',
  'https://www.food.com',
  'https://www.epicurious.com',
  'https://www.bbcgoodfood.com'
];

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

    // Step 2: Synthesize unique ViralCarrot recipes
    const synthesizedRecipes = await synthesizeRecipes(externalRecipes, mainFood, ingredients, filters);
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
    // Search TheMealDB free API
    const mealDbRecipes = await searchTheMealDB(mainFood);
    recipes.push(...mealDbRecipes);
    
    // Search Edamam free tier (if available)
    const edamamRecipes = await searchEdamam(mainFood, ingredients, filters);
    recipes.push(...edamamRecipes);
    
    // Web scraping from free recipe sites
    const scrapedRecipes = await scrapeRecipeSites(mainFood, ingredients);
    recipes.push(...scrapedRecipes);
    
  } catch (error) {
    console.error('Error searching external recipes:', error);
  }
  
  return recipes;
}

async function searchTheMealDB(mainFood: string): Promise<ExternalRecipe[]> {
  try {
    const response = await axios.get(`${MEALDB_BASE}/search.php?s=${encodeURIComponent(mainFood)}`);
    const data = response.data;
    
    if (!data.meals) return [];
    
    return data.meals.slice(0, 5).map((meal: any) => ({
      title: meal.strMeal,
      ingredients: extractIngredients(meal),
      steps: meal.strInstructions ? meal.strInstructions.split('\r\n').filter((step: string) => step.trim()) : [],
      cookingTime: 30, // Default
      cuisine: 'International',
      mealType: 'dinner',
      dietaryStyle: 'none',
      image: meal.strMealThumb,
      source: 'TheMealDB'
    }));
  } catch (error) {
    console.error('TheMealDB search error:', error);
    return [];
  }
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

async function searchEdamam(mainFood: string, ingredients: string[], filters: any): Promise<ExternalRecipe[]> {
  // Note: Edamam requires API key, so we'll simulate with mock data
  // In production, you would use the free tier with proper API key
  return [];
}

async function scrapeRecipeSites(mainFood: string, ingredients: string[]): Promise<ExternalRecipe[]> {
  const recipes: ExternalRecipe[] = [];
  
  try {
    // Search AllRecipes
    const allRecipesData = await scrapeAllRecipes(mainFood);
    recipes.push(...allRecipesData);
    
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

async function synthesizeRecipes(externalRecipes: ExternalRecipe[], mainFood: string, ingredients: string[], filters: any): Promise<SynthesizedRecipe[]> {
  const synthesized: SynthesizedRecipe[] = [];
  
  // If we have external recipes, synthesize from them
  if (externalRecipes.length > 0) {
    for (let i = 0; i < Math.min(10, externalRecipes.length); i++) {
      const external = externalRecipes[i];
      const synthesizedRecipe = await createSynthesizedRecipe(external, mainFood, ingredients, filters, i + 1);
      synthesized.push(synthesizedRecipe);
    }
  }
  
  // If we don't have enough external recipes, create some from our knowledge base
  if (synthesized.length < 10) {
    const knowledgeBaseRecipes = getKnowledgeBaseRecipes(mainFood, ingredients, filters);
    for (let i = synthesized.length; i < 10 && i < synthesized.length + knowledgeBaseRecipes.length; i++) {
      const baseRecipe = knowledgeBaseRecipes[i - synthesized.length];
      const synthesizedRecipe = await createSynthesizedRecipe(baseRecipe, mainFood, ingredients, filters, i + 1);
      synthesized.push(synthesizedRecipe);
    }
  }
  
  return synthesized;
}

async function createSynthesizedRecipe(baseRecipe: ExternalRecipe, mainFood: string, ingredients: string[], filters: any, index: number): Promise<SynthesizedRecipe> {
  // Create unique title
  const title = generateUniqueTitle(baseRecipe.title, mainFood, index);
  
  // Create unique description
  const description = generateUniqueDescription(mainFood, filters);
  
  // Synthesize ingredients
  const synthesizedIngredients = synthesizeIngredients(baseRecipe.ingredients, mainFood, ingredients);
  
  // Synthesize steps
  const synthesizedSteps = synthesizeSteps(baseRecipe.steps, mainFood, ingredients);
  
  // Generate tags
  const tags = generateTags(filters, mainFood);
  
  return {
    id: `viralcarrot-${Date.now()}-${index}`,
    title,
    image: baseRecipe.image || getDefaultImage(mainFood),
    description,
    ingredients: synthesizedIngredients,
    steps: synthesizedSteps,
    cookingTime: baseRecipe.cookingTime || 30,
    cuisine: filters.cuisine || baseRecipe.cuisine || 'International',
    mealType: filters.mealType || baseRecipe.mealType || 'dinner',
    dietaryStyle: filters.dietaryStyle || baseRecipe.dietaryStyle || 'none',
    tags,
    createdBy: 'ViralCarrot'
  };
}

function generateUniqueTitle(originalTitle: string, mainFood: string, index: number): string {
  const titleVariations = [
    `ViralCarrot's ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Delight`,
    `Ultimate ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Experience`,
    `Chef's Special ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)}`,
    `Gourmet ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Creation`,
    `Signature ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Recipe`,
    `Fusion ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Magic`,
    `Premium ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Blend`,
    `Artisan ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Style`,
    `Master ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Technique`,
    `Elite ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Formula`
  ];
  
  return titleVariations[index % titleVariations.length];
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

function synthesizeIngredients(originalIngredients: string[], mainFood: string, userIngredients: string[]): string[] {
  const synthesized: string[] = [];
  
  // Always include the main food
  synthesized.push(`1 lb ${mainFood}`);
  
  // Add user ingredients that make sense
  userIngredients.forEach(ingredient => {
    if (ingredient.trim()) {
      synthesized.push(`2 tbsp ${ingredient.trim()}`);
    }
  });
  
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
  
  return synthesized.slice(0, 8); // Limit to 8 ingredients
}

function synthesizeSteps(originalSteps: string[], mainFood: string, userIngredients: string[]): string[] {
  const steps = [
    `Prepare your ${mainFood} by cleaning and cutting into appropriate pieces.`,
    `Heat a large pan over medium-high heat and add olive oil.`,
    `Season the ${mainFood} with salt, pepper, and your favorite herbs.`,
    `Cook the ${mainFood} until golden brown and cooked through.`,
    `Add your additional ingredients and stir to combine.`,
    `Let the flavors meld together for a few minutes.`,
    `Taste and adjust seasoning as needed.`,
    `Serve hot and enjoy your delicious creation!`
  ];
  
  return steps;
}

function generateTags(filters: any, mainFood: string): string[] {
  const tags = [mainFood];
  
  if (filters.cuisine) tags.push(filters.cuisine);
  if (filters.mealType) tags.push(filters.mealType);
  if (filters.dietaryStyle) tags.push(filters.dietaryStyle);
  
  return tags;
}

function getDefaultImage(mainFood: string): string {
  const imageMap: { [key: string]: string } = {
    'chicken': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=300&fit=crop',
    'beef': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=300&fit=crop',
    'fish': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=300&fit=crop',
    'salmon': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=300&fit=crop',
    'prawns': 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&h=300&fit=crop',
    'vegetables': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&h=300&fit=crop',
    'tofu': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=300&fit=crop',
    'eggs': 'https://images.unsplash.com/photo-1572441713132-51c75654db73?w=500&h=300&fit=crop'
  };
  
  return imageMap[mainFood.toLowerCase()] || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=300&fit=crop';
}

function getKnowledgeBaseRecipes(mainFood: string, ingredients: string[], filters: any): ExternalRecipe[] {
  // Fallback knowledge base recipes
  const knowledgeBase: { [key: string]: ExternalRecipe[] } = {
    'chicken': [
      {
        title: 'Classic Chicken Recipe',
        ingredients: ['chicken breast', 'garlic', 'onion', 'herbs'],
        steps: ['Season chicken', 'Cook until done', 'Serve hot'],
        cookingTime: 25,
        cuisine: 'International',
        mealType: 'dinner',
        dietaryStyle: 'none',
        image: '',
        source: 'Knowledge Base'
      }
    ],
    'beef': [
      {
        title: 'Traditional Beef Dish',
        ingredients: ['beef', 'garlic', 'onion', 'spices'],
        steps: ['Prepare beef', 'Season well', 'Cook to perfection'],
        cookingTime: 30,
        cuisine: 'International',
        mealType: 'dinner',
        dietaryStyle: 'none',
        image: '',
        source: 'Knowledge Base'
      }
    ]
  };
  
  return knowledgeBase[mainFood.toLowerCase()] || [];
}
