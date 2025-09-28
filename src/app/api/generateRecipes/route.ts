import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import NodeCache from 'node-cache';
import { getUnsplashFetcher } from '@/utils/unsplash';

// Initialize cache with 30 minute TTL
const cache = new NodeCache({ stdTTL: 1800 });

interface ExternalRecipe {
  id?: string;
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

// Enhanced recipe title templates organized by main ingredient
const RECIPE_TITLE_TEMPLATES = {
  chicken: [
    "Crispy Garlic Butter Chicken",
    "Honey Glazed Chicken Thighs",
    "Lemon Herb Roasted Chicken",
    "Spicy Buffalo Chicken Wings",
    "Creamy Chicken Alfredo",
    "Teriyaki Chicken Stir-Fry",
    "Mediterranean Chicken Skewers",
    "BBQ Chicken Breast",
    "Chicken Tikka Masala",
    "Parmesan Crusted Chicken"
  ],
  beef: [
    "Classic Beef Stroganoff",
    "Juicy Beef Burgers",
    "Beef and Broccoli Stir-Fry",
    "Slow-Cooked Beef Stew",
    "Beef Tacos with Guacamole",
    "Beef Wellington",
    "Korean Beef Bulgogi",
    "Beef and Mushroom Risotto",
    "Beef Fajitas",
    "Beef Bourguignon"
  ],
  salmon: [
    "Pan-Seared Salmon with Dill",
    "Honey Glazed Salmon",
    "Cedar Plank Salmon",
    "Salmon Teriyaki Bowl",
    "Lemon Garlic Salmon",
    "Salmon Poke Bowl",
    "Grilled Salmon with Herbs",
    "Salmon Caesar Salad",
    "Salmon Sushi Rolls",
    "Baked Salmon with Vegetables"
  ],
  pasta: [
    "Creamy Carbonara Pasta",
    "Spaghetti Aglio e Olio",
    "Pasta Primavera",
    "Chicken Pesto Pasta",
    "Spicy Arrabbiata Pasta",
    "Pasta alla Vodka",
    "Lobster Ravioli",
    "Pasta with Marinara Sauce",
    "Cacio e Pepe",
    "Pasta with Meatballs"
  ],
  rice: [
    "Spanish Paella",
    "Chicken Fried Rice",
    "Risotto Milanese",
    "Jambalaya Rice",
    "Biryani Rice Bowl",
    "Sushi Rice Rolls",
    "Coconut Rice Pudding",
    "Wild Rice Pilaf",
    "Rice and Beans",
    "Sticky Rice with Mango"
  ],
  vegetables: [
    "Roasted Vegetable Medley",
    "Stuffed Bell Peppers",
    "Ratatouille",
    "Vegetable Stir-Fry",
    "Grilled Vegetable Skewers",
    "Vegetable Curry",
    "Stuffed Zucchini",
    "Roasted Brussels Sprouts",
    "Vegetable Lasagna",
    "Caprese Salad"
  ],
  fish: [
    "Fish and Chips",
    "Pan-Fried Fish with Lemon",
    "Fish Tacos",
    "Baked Fish with Herbs",
    "Fish Curry",
    "Grilled Fish Steaks",
    "Fish Ceviche",
    "Fish Chowder",
    "Fish Tempura",
    "Mediterranean Fish Stew"
  ],
  shrimp: [
    "Garlic Butter Shrimp",
    "Shrimp Scampi",
    "Coconut Shrimp",
    "Shrimp Fried Rice",
    "Shrimp Tacos",
    "Shrimp and Grits",
    "Shrimp Pad Thai",
    "Shrimp Cocktail",
    "Shrimp Stir-Fry",
    "Shrimp Etouffee"
  ],
  octopus: [
    "Grilled Octopus with Chimichurri",
    "Octopus Carpaccio",
    "Spanish Octopus Tapas",
    "Octopus Ceviche",
    "Braised Octopus Stew",
    "Octopus Salad",
    "Octopus Pasta",
    "Mediterranean Octopus",
    "Octopus with Potatoes",
    "Octopus Rice Bowl"
  ],
  lamb: [
    "Rack of Lamb with Herbs",
    "Lamb Chops with Mint",
    "Lamb Curry",
    "Lamb Gyros",
    "Braised Lamb Shanks",
    "Lamb Kebabs",
    "Lamb Stew",
    "Lamb Biryani",
    "Lamb Tagine",
    "Lamb Burgers"
  ],
  pork: [
    "Pork Tenderloin with Apples",
    "Pulled Pork Sandwich",
    "Pork Chops with Sage",
    "Pork Belly Bao Buns",
    "Pork Stir-Fry",
    "Pork Carnitas",
    "Pork Schnitzel",
    "Pork and Beans",
    "Pork Dumplings",
    "Pork Loin Roast"
  ],
  tofu: [
    "Crispy Tofu Stir-Fry",
    "Tofu Scramble",
    "Mapo Tofu",
    "Tofu Buddha Bowl",
    "Tofu Curry",
    "Tofu Tacos",
    "Tofu Pad Thai",
    "Tofu Scramble",
    "Tofu Soup",
    "Tofu Teriyaki"
  ],
  eggs: [
    "Perfect Scrambled Eggs",
    "Eggs Benedict",
    "Shakshuka",
    "French Omelette",
    "Eggs Florentine",
    "Egg Fried Rice",
    "Egg Salad Sandwich",
    "Quiche Lorraine",
    "Egg Drop Soup",
    "Deviled Eggs"
  ],
  cheese: [
    "Three Cheese Mac and Cheese",
    "Cheese Fondue",
    "Grilled Cheese Sandwich",
    "Cheese Platter",
    "Cheese Soufflé",
    "Cheese Quesadillas",
    "Cheese Pizza",
    "Cheese and Crackers",
    "Cheese Stuffed Mushrooms",
    "Cheese Board"
  ],
  mushroom: [
    "Creamy Mushroom Risotto",
    "Stuffed Mushrooms",
    "Mushroom Stroganoff",
    "Mushroom Soup",
    "Grilled Portobello Mushrooms",
    "Mushroom Pasta",
    "Mushroom Stir-Fry",
    "Mushroom Pizza",
    "Mushroom Gravy",
    "Mushroom Tacos"
  ],
  potato: [
    "Crispy Roasted Potatoes",
    "Loaded Baked Potatoes",
    "Potato Gnocchi",
    "Mashed Potatoes",
    "Potato Salad",
    "French Fries",
    "Potato Soup",
    "Scalloped Potatoes",
    "Potato Pancakes",
    "Sweet Potato Fries"
  ],
  bread: [
    "Artisan Sourdough Bread",
    "Garlic Bread",
    "Banana Bread",
    "Focaccia Bread",
    "Brioche French Toast",
    "Bread Pudding",
    "Garlic Naan",
    "Cornbread",
    "Breadsticks",
    "Cinnamon Rolls"
  ]
};

// Cooking method variations for more dynamic titles
const COOKING_METHODS = [
  "Pan-Seared", "Grilled", "Roasted", "Braised", "Sautéed", "Baked", 
  "Fried", "Steamed", "Poached", "Smoked", "Slow-Cooked", "Quick-Fried"
];

// Flavor profile enhancers
const FLAVOR_ENHANCERS = [
  "Garlic Butter", "Lemon Herb", "Spicy", "Creamy", "Honey Glazed", 
  "Teriyaki", "Mediterranean", "Asian-Inspired", "Smoky", "Tangy"
];

// Cuisine-specific title modifiers
const CUISINE_MODIFIERS = {
  italian: ["Al Dente", "Authentic Italian", "Traditional", "Rustic"],
  asian: ["Asian-Inspired", "Wok-Fried", "Umami-Rich", "Ginger-Scented"],
  mexican: ["Spicy", "Authentic Mexican", "Street-Style", "Salsa-Topped"],
  mediterranean: ["Mediterranean", "Olive Oil Drizzled", "Herb-Infused", "Sun-Dried"],
  indian: ["Curry-Spiced", "Aromatic", "Tandoori-Style", "Masala-Infused"],
  american: ["Classic American", "Comfort Food", "All-American", "Homestyle"]
};

export async function POST(request: NextRequest) {
  try {
    console.log('🍳 Recipe Generator API: Starting enhanced recipe generation');
    
    const body = await request.json();
    const { mainFood, ingredients = [], filters = {}, includeExternal = true, page = 1 } = body;

    console.log('📝 Recipe API: Received request:', { mainFood, ingredients, filters, includeExternal, page });

    if (!mainFood || !mainFood.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please enter a main food item' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `recipes_${mainFood}_${JSON.stringify(ingredients)}_${JSON.stringify(filters)}_${page}`;
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      console.log('⚡ Recipe API: Returning cached result');
      return NextResponse.json(cachedResult);
    }

    // Generate nutrition data
    const nutritionData = generateNutritionData(mainFood);

    // Fetch external recipes if requested
    let externalRecipes: ExternalRecipe[] = [];
    if (includeExternal) {
      try {
        const externalResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/externalRecipes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mainFood, ingredients, filters })
        });
        
        if (externalResponse.ok) {
          const externalData = await externalResponse.json();
          if (externalData.success) {
            externalRecipes = externalData.recipes || [];
            console.log(`🌐 External API: Found ${externalRecipes.length} external recipes`);
          }
        }
      } catch (error) {
        console.warn('⚠️ External recipes fetch failed:', error);
      }
    }

    // Generate ViralCarrot recipes with optimized image loading
    const viralCarrotRecipes = await generateViralCarrotRecipes(mainFood, ingredients, filters, nutritionData, 6);

    // Combine and rank recipes
    const allRecipes = [...viralCarrotRecipes, ...externalRecipes];
    const rankedRecipes = rankRecipesByRelevance(allRecipes, mainFood, ingredients);

    // Paginate results
    const startIndex = (page - 1) * 6;
    const endIndex = startIndex + 6;
    const paginatedRecipes = rankedRecipes.slice(startIndex, endIndex);

    const result = {
      success: true,
      recipes: paginatedRecipes,
      total: rankedRecipes.length,
      page,
      hasMore: endIndex < rankedRecipes.length,
      sources: {
        viralCarrot: viralCarrotRecipes.length,
        external: externalRecipes.length
      }
    };

    // Cache the result
    cache.set(cacheKey, result);
    console.log(`✅ Recipe API: Generated ${paginatedRecipes.length} recipes (${viralCarrotRecipes.length} ViralCarrot + ${externalRecipes.length} external)`);

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Recipe API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate recipes' },
      { status: 500 }
    );
  }
}

// Generate ViralCarrot recipes with optimized image loading
async function generateViralCarrotRecipes(
  mainFood: string, 
  ingredients: string[], 
  filters: RecipeFilters, 
  nutritionData: NutritionData,
  count: number
): Promise<SynthesizedRecipe[]> {
  const recipes: SynthesizedRecipe[] = [];
  const sessionKey = `session_${Date.now()}`;

  for (let i = 0; i < count; i++) {
    const recipe = await generateEnhancedRecipe(
      [], // No external recipes for ViralCarrot originals
      mainFood,
      ingredients,
      filters,
      nutritionData,
      i,
      sessionKey
    );
    recipes.push(recipe);
  }

  return recipes;
}

// Generate enhanced recipe with proper titles and optimized images
async function generateEnhancedRecipe(
  relevantRecipes: ExternalRecipe[],
  mainFood: string,
  ingredients: string[],
  filters: RecipeFilters,
  nutritionData: NutritionData,
  index: number,
  sessionKey: string
): Promise<SynthesizedRecipe> {
  // Generate proper recipe title (FIXED: No more undefined)
  const title = generateProperRecipeTitle(mainFood, filters, index);
  
  // Generate contextual ingredients
  const mergedIngredients = generateContextualIngredients(mainFood, ingredients, filters);
  
  // Generate cooking steps
  const cookingSteps = generateCookingSteps(mainFood, mergedIngredients, filters, index);
  
  // Determine cuisine and meal type
  const cuisine = determineCuisine(filters);
  const mealType = determineMealType(filters);
  
  // Get optimized image (use fallback first, Unsplash only if needed)
  const image = await getOptimizedRecipeImage(title, mainFood, cuisine, mealType, index, sessionKey);
  
  // Generate description
  const description = generateRecipeDescription(title, mainFood, cuisine, mealType);
  
  // Calculate match score (FIXED: Proper ingredient matching)
  const matchScore = calculateMatchScore(mergedIngredients, ingredients);
  
  // Calculate ingredient match percentage (FIXED: Handle empty ingredients)
  const ingredientMatch = calculateIngredientMatch(mergedIngredients, ingredients, mainFood);
  
  // Generate tags
  const tags = generateRecipeTags(mainFood, cuisine, mealType, filters);

  return {
    id: `viralcarrot-${Date.now()}-${index}`,
    title,
    image,
    description,
    ingredients: mergedIngredients,
    steps: cookingSteps,
    cookingTime: calculateCookingTime(filters),
    cuisine,
    mealType,
    dietaryStyle: filters.dietaryStyle,
    tags,
    createdBy: 'ViralCarrot Chef',
    matchScore,
    rating: 4.3 + (Math.random() * 0.7), // 4.3-5.0 rating
    difficulty: determineDifficulty(mainFood, mealType),
    servings: 4 + Math.floor(Math.random() * 3), // 4-6 servings
    nutrition: {
      calories: nutritionData.calories + Math.floor(Math.random() * 200),
      protein: nutritionData.protein + Math.floor(Math.random() * 20),
      carbs: nutritionData.carbs + Math.floor(Math.random() * 30),
      fat: nutritionData.fat + Math.floor(Math.random() * 15)
    },
    seoDescription: `${title} - A delicious ${cuisine} ${mealType} recipe featuring ${mainFood}. Perfect for any occasion.`,
    ingredientMatch,
    isExternal: false
  };
}

// Calculate ingredient match percentage (FIXED: Handle empty ingredients)
function calculateIngredientMatch(recipeIngredients: string[], userIngredients: string[], mainFood: string): {
  availableIngredients: string[];
  missingIngredients: string[];
  matchPercentage: number;
} {
  // If no user ingredients provided, show high match for main food
  if (userIngredients.length === 0) {
    const mainFoodMatch = recipeIngredients.some(ing => 
      ing.toLowerCase().includes(mainFood.toLowerCase()) || 
      mainFood.toLowerCase().includes(ing.toLowerCase())
    );
    
    return {
      availableIngredients: mainFoodMatch ? [mainFood] : [],
      missingIngredients: [],
      matchPercentage: mainFoodMatch ? 85 : 0
    };
  }

  const availableIngredients: string[] = [];
  const missingIngredients: string[] = [];

  // Check each user ingredient against recipe ingredients
  userIngredients.forEach(userIng => {
    const normalizedUserIng = userIng.toLowerCase().trim();
    const found = recipeIngredients.some(recipeIng => {
      const normalizedRecipeIng = recipeIng.toLowerCase().trim();
      return normalizedRecipeIng.includes(normalizedUserIng) || 
             normalizedUserIng.includes(normalizedRecipeIng) ||
             normalizedRecipeIng.includes(normalizedUserIng.split(' ')[0]) ||
             normalizedUserIng.includes(normalizedRecipeIng.split(' ')[0]);
    });
    
    if (found) {
      availableIngredients.push(userIng);
    } else {
      missingIngredients.push(userIng);
    }
  });

  const matchPercentage = Math.round((availableIngredients.length / userIngredients.length) * 100);

  return {
    availableIngredients,
    missingIngredients,
    matchPercentage
  };
}

// Generate proper recipe titles based on main ingredient (FIXED)
function generateProperRecipeTitle(mainFood: string, filters: RecipeFilters, index: number): string {
  const normalizedFood = mainFood.toLowerCase().trim();
  
  // Get cuisine-specific modifiers
  const cuisineModifiers = filters.cuisine ? CUISINE_MODIFIERS[filters.cuisine as keyof typeof CUISINE_MODIFIERS] || [] : [];
  
  // Get base templates for the main food
  const baseTemplates = RECIPE_TITLE_TEMPLATES[normalizedFood as keyof typeof RECIPE_TITLE_TEMPLATES] || 
    RECIPE_TITLE_TEMPLATES[Object.keys(RECIPE_TITLE_TEMPLATES).find(key => 
      normalizedFood.includes(key) || key.includes(normalizedFood)
    ) as keyof typeof RECIPE_TITLE_TEMPLATES] || 
    [
      `Delicious ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Recipe`,
      `Perfect ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Dish`,
      `Amazing ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Creation`
    ];

  // Select a base template
  const baseTemplate = baseTemplates[index % baseTemplates.length];
  
  // Add cooking method variation
  const cookingMethod = COOKING_METHODS[index % COOKING_METHODS.length];
  
  // Add flavor enhancer
  const flavorEnhancer = FLAVOR_ENHANCERS[index % FLAVOR_ENHANCERS.length];
  
  // Add cuisine modifier if applicable
  const cuisineModifier = cuisineModifiers[index % cuisineModifiers.length];
  
  // Create variations (FIXED: No more undefined)
  const titleVariations = [
    baseTemplate,
    `${cookingMethod} ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)}`,
    `${flavorEnhancer} ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)}`,
    cuisineModifier ? `${cuisineModifier} ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)}` : baseTemplate,
    `${baseTemplate} with ${flavorEnhancer}`,
    `${cookingMethod} ${baseTemplate}`,
    cuisineModifier ? `${cuisineModifier} ${baseTemplate}` : baseTemplate
  ];
  
  return titleVariations[index % titleVariations.length];
}

// Generate contextual ingredients based on main food and filters
function generateContextualIngredients(mainFood: string, userIngredients: string[], filters: RecipeFilters): string[] {
  const baseIngredients = [mainFood];
  const contextualIngredients: string[] = [];
  
  // Add common ingredients based on main food
  const commonIngredients = {
    chicken: ['olive oil', 'salt', 'black pepper', 'garlic', 'onion'],
    beef: ['olive oil', 'salt', 'black pepper', 'garlic', 'onion', 'beef broth'],
    salmon: ['olive oil', 'lemon', 'salt', 'black pepper', 'dill', 'butter'],
    pasta: ['pasta', 'olive oil', 'garlic', 'salt', 'black pepper', 'parmesan cheese'],
    rice: ['rice', 'olive oil', 'salt', 'onion', 'garlic', 'vegetable broth'],
    vegetables: ['olive oil', 'salt', 'black pepper', 'garlic', 'herbs'],
    fish: ['olive oil', 'lemon', 'salt', 'black pepper', 'herbs', 'butter'],
    shrimp: ['olive oil', 'garlic', 'lemon', 'salt', 'black pepper', 'butter'],
    octopus: ['olive oil', 'garlic', 'lemon', 'salt', 'black pepper', 'paprika'],
    lamb: ['olive oil', 'garlic', 'rosemary', 'salt', 'black pepper', 'mint'],
    pork: ['olive oil', 'garlic', 'sage', 'salt', 'black pepper', 'apple'],
    tofu: ['soy sauce', 'sesame oil', 'garlic', 'ginger', 'scallions'],
    eggs: ['butter', 'salt', 'black pepper', 'milk', 'cheese'],
    cheese: ['bread', 'butter', 'garlic', 'herbs'],
    mushroom: ['olive oil', 'garlic', 'thyme', 'salt', 'black pepper', 'butter'],
    potato: ['olive oil', 'salt', 'black pepper', 'garlic', 'herbs'],
    bread: ['flour', 'yeast', 'salt', 'water', 'olive oil']
  };
  
  const foodKey = Object.keys(commonIngredients).find(key => 
    mainFood.toLowerCase().includes(key) || key.includes(mainFood.toLowerCase())
  ) as keyof typeof commonIngredients;
  
  if (foodKey && commonIngredients[foodKey]) {
    contextualIngredients.push(...commonIngredients[foodKey]);
  }
  
  // Add user ingredients
  contextualIngredients.push(...userIngredients);
  
  // Add cuisine-specific ingredients
  if (filters.cuisine) {
    const cuisineIngredients = {
      italian: ['basil', 'oregano', 'parmesan cheese', 'tomato'],
      asian: ['soy sauce', 'ginger', 'sesame oil', 'scallions'],
      mexican: ['cilantro', 'lime', 'jalapeño', 'cumin'],
      mediterranean: ['olive oil', 'lemon', 'oregano', 'feta cheese'],
      indian: ['curry powder', 'cumin', 'coriander', 'turmeric'],
      american: ['ketchup', 'mustard', 'bacon', 'cheese']
    };
    
    const cuisineIngs = cuisineIngredients[filters.cuisine as keyof typeof cuisineIngredients];
    if (cuisineIngs) {
      contextualIngredients.push(...cuisineIngs.slice(0, 2)); // Add 2 cuisine-specific ingredients
    }
  }
  
  // Remove duplicates and return
  return [...new Set(contextualIngredients)].slice(0, 12);
}

// Generate cooking steps based on main food and ingredients
function generateCookingSteps(mainFood: string, ingredients: string[], filters: RecipeFilters, index: number): string[] {
  const steps: string[] = [];
  
  // Preparation step
  steps.push(`Prepare the ${mainFood} by washing and cutting as needed.`);
  
  // Seasoning step
  if (ingredients.includes('salt') && ingredients.includes('black pepper')) {
    steps.push(`Season the ${mainFood} with salt and black pepper to taste.`);
  }
  
  // Cooking method based on filters
  if (filters.cookingTime === '15') {
    steps.push(`Heat a pan over medium-high heat and cook the ${mainFood} for 3-4 minutes per side.`);
  } else if (filters.cookingTime === '30') {
    steps.push(`Heat oil in a large pan over medium heat. Add the ${mainFood} and cook for 8-10 minutes, turning occasionally.`);
  } else {
    steps.push(`Preheat oven to 400°F (200°C). Place the ${mainFood} in a baking dish and cook for 20-25 minutes.`);
  }
  
  // Add vegetables if present
  const vegetables = ingredients.filter(ing => 
    ['onion', 'garlic', 'bell pepper', 'tomato', 'mushroom', 'carrot', 'celery'].includes(ing.toLowerCase())
  );
  if (vegetables.length > 0) {
    steps.push(`Add ${vegetables.join(', ')} to the pan and cook for an additional 5-7 minutes.`);
  }
  
  // Finishing step
  if (ingredients.includes('lemon')) {
    steps.push(`Squeeze fresh lemon juice over the ${mainFood} before serving.`);
  } else if (ingredients.includes('herbs')) {
    steps.push(`Garnish with fresh herbs and serve immediately.`);
  } else {
    steps.push(`Taste and adjust seasoning as needed. Serve hot.`);
  }
  
  return steps;
}

// Determine cuisine based on filters
function determineCuisine(filters: RecipeFilters): string {
  if (filters.cuisine) {
    return filters.cuisine.charAt(0).toUpperCase() + filters.cuisine.slice(1);
  }
  return 'International';
}

// Determine meal type based on filters
function determineMealType(filters: RecipeFilters): string {
  if (filters.mealType) {
    return filters.mealType.charAt(0).toUpperCase() + filters.mealType.slice(1);
  }
  return 'Dinner';
}

// Calculate cooking time based on filters
function calculateCookingTime(filters: RecipeFilters): number {
  if (filters.cookingTime) {
    return parseInt(filters.cookingTime);
  }
  return 30;
}

// Determine difficulty based on main food and meal type
function determineDifficulty(mainFood: string, mealType: string): string {
  const complexFoods = ['octopus', 'lamb', 'beef wellington', 'soufflé'];
  const isComplex = complexFoods.some(food => mainFood.toLowerCase().includes(food));
  
  if (isComplex) return 'Hard';
  if (mealType === 'Breakfast') return 'Easy';
  return 'Medium';
}

// Generate recipe description
function generateRecipeDescription(title: string, mainFood: string, cuisine: string, mealType: string): string {
  return `${title} is a delicious ${cuisine} ${mealType.toLowerCase()} recipe featuring fresh ${mainFood}. This recipe combines simple ingredients with traditional cooking techniques to create a flavorful and satisfying meal that's perfect for any occasion.`;
}

// Generate recipe tags
function generateRecipeTags(mainFood: string, cuisine: string, mealType: string, filters: RecipeFilters): string[] {
  const tags = [cuisine.toLowerCase(), mealType.toLowerCase(), mainFood.toLowerCase()];
  
  if (filters.dietaryStyle) {
    tags.push(filters.dietaryStyle.toLowerCase());
  }
  
  if (filters.cookingTime === '15') {
    tags.push('quick', 'easy');
  } else if (filters.cookingTime === '60') {
    tags.push('slow-cooked', 'comfort-food');
  }
  
  return tags;
}

// Calculate match score (FIXED: Proper ingredient matching)
function calculateMatchScore(recipeIngredients: string[], userIngredients: string[]): number {
  if (userIngredients.length === 0) return 0.9;
  
  const matches = userIngredients.filter(userIng => 
    recipeIngredients.some(recipeIng => 
      recipeIng.toLowerCase().includes(userIng.toLowerCase()) ||
      userIng.toLowerCase().includes(recipeIng.toLowerCase())
    )
  ).length;
  
  return Math.min(0.95, matches / userIngredients.length);
}

// Generate nutrition data
function generateNutritionData(mainFood: string): NutritionData {
  const baseNutrition = {
    chicken: { calories: 200, protein: 30, carbs: 0, fat: 8 },
    beef: { calories: 250, protein: 25, carbs: 0, fat: 15 },
    salmon: { calories: 220, protein: 25, carbs: 0, fat: 12 },
    pasta: { calories: 200, protein: 8, carbs: 40, fat: 2 },
    rice: { calories: 150, protein: 3, carbs: 35, fat: 0 },
    vegetables: { calories: 50, protein: 2, carbs: 10, fat: 0 },
    fish: { calories: 180, protein: 20, carbs: 0, fat: 10 },
    shrimp: { calories: 100, protein: 20, carbs: 0, fat: 1 },
    octopus: { calories: 140, protein: 25, carbs: 0, fat: 2 },
    lamb: { calories: 280, protein: 25, carbs: 0, fat: 18 },
    pork: { calories: 240, protein: 22, carbs: 0, fat: 16 },
    tofu: { calories: 80, protein: 8, carbs: 2, fat: 4 },
    eggs: { calories: 70, protein: 6, carbs: 0, fat: 5 },
    cheese: { calories: 100, protein: 6, carbs: 1, fat: 8 },
    mushroom: { calories: 20, protein: 3, carbs: 3, fat: 0 },
    potato: { calories: 80, protein: 2, carbs: 18, fat: 0 },
    bread: { calories: 80, protein: 3, carbs: 15, fat: 1 }
  };
  
  const foodKey = Object.keys(baseNutrition).find(key => 
    mainFood.toLowerCase().includes(key) || key.includes(mainFood.toLowerCase())
  ) as keyof typeof baseNutrition;
  
  return baseNutrition[foodKey] || { calories: 150, protein: 10, carbs: 20, fat: 5 };
}

// Get optimized recipe image (use fallback first, Unsplash only if needed)
async function getOptimizedRecipeImage(
  title: string, 
  mainFood: string, 
  cuisine: string, 
  mealType: string, 
  index: number, 
  sessionKey: string
): Promise<string> {
  // First, try to get a good fallback image
  const fallbackImage = getFallbackImage(mainFood, index);
  
  // Only use Unsplash if we really need a better image
  // This minimizes API usage
  try {
    const unsplashFetcher = getUnsplashFetcher(sessionKey);
    
    // Use Unsplash only for specific cases where we need better images
    if (index < 3) { // Only use Unsplash for first 3 recipes to save API calls
      const unsplashImage = await unsplashFetcher.getRecipeImage(title, mainFood, cuisine, mealType, index);
      if (unsplashImage && !unsplashImage.includes('fallback')) {
        console.log(`🖼️ Unsplash: Got image for "${title}"`);
        return unsplashImage;
      }
    }
  } catch (error) {
    console.warn('⚠️ Unsplash not available, using fallback:', error);
  }
  
  // Use fallback image
  console.log(`🖼️ Fallback: Using curated image for "${title}"`);
  return fallbackImage;
}

// Get fallback image (food-only images)
function getFallbackImage(mainFood: string, index: number): string {
  const fallbackImages = {
    chicken: [
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&q=80', // Cooked chicken breast
      'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80', // Grilled chicken
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80'  // Chicken dish
    ],
    beef: [
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80', // Cooked beef
      'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80', // Beef steak
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80'  // Beef dish
    ],
    salmon: [
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80', // Cooked salmon
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80', // Salmon fillet
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80'  // Salmon dish
    ],
    pasta: [
      'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&q=80', // Pasta dish
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80', // Spaghetti
      'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&q=80'  // Pasta bowl
    ],
    rice: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80', // Rice dish
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80', // Rice bowl
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80'  // Rice meal
    ],
    vegetables: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80', // Vegetable dish
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80', // Roasted vegetables
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80'  // Vegetable medley
    ],
    fish: [
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80', // Fish dish
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80', // Fish fillet
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80'  // Fish meal
    ],
    shrimp: [
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80', // Shrimp dish
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80', // Shrimp scampi
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80'  // Shrimp meal
    ],
    octopus: [
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80', // Octopus dish
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80', // Grilled octopus
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80'  // Octopus meal
    ]
  };
  
  const foodKey = Object.keys(fallbackImages).find(key => 
    mainFood.toLowerCase().includes(key) || key.includes(mainFood.toLowerCase())
  ) as keyof typeof fallbackImages;
  
  if (foodKey && fallbackImages[foodKey]) {
    const images = fallbackImages[foodKey];
    return images[index % images.length];
  }
  
  // Ultimate fallback - generic food image
  return 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80';
}

// Rank recipes by relevance
function rankRecipesByRelevance(recipes: SynthesizedRecipe[], mainFood: string, ingredients: string[]): SynthesizedRecipe[] {
  return recipes.sort((a, b) => {
    // ViralCarrot recipes first
    if (a.isExternal === false && b.isExternal === true) return -1;
    if (a.isExternal === true && b.isExternal === false) return 1;
    
    // Then by match score
    return b.matchScore - a.matchScore;
  });
}
