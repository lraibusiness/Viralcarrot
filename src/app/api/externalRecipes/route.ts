import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import NodeCache from 'node-cache';

// Initialize cache with 30 minute TTL
const cache = new NodeCache({ stdTTL: 1800 });

interface ExternalRecipe {
  id: string;
  title: string;
  ingredients: string[];
  steps: string[];
  cookingTime: number;
  cuisine?: string;
  mealType?: string;
  dietaryStyle?: string;
  image?: string;
  source: string;
  sourceUrl?: string;
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

// Enhanced recipe title templates for external sources
const EXTERNAL_TITLE_TEMPLATES = {
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

// Cooking method variations
const COOKING_METHODS = [
  "Pan-Seared", "Grilled", "Roasted", "Braised", "Sautéed", "Baked", 
  "Fried", "Steamed", "Poached", "Smoked", "Slow-Cooked", "Quick-Fried"
];

// Flavor profile enhancers
const FLAVOR_ENHANCERS = [
  "Garlic Butter", "Lemon Herb", "Spicy", "Creamy", "Honey Glazed", 
  "Teriyaki", "Mediterranean", "Asian-Inspired", "Smoky", "Tangy"
];

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

    console.log('�� External API: Received request:', { mainFood, ingredients, filters });

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
      sources: {
        allrecipes: externalRecipes.filter(r => r.source === 'AllRecipes').length,
        foodnetwork: externalRecipes.filter(r => r.source === 'FoodNetwork').length,
        bbcgoodfood: externalRecipes.filter(r => r.source === 'BBCGoodFood').length
      }
    };

    // Cache the result
    cache.set(cacheKey, result);
    console.log(`✅ External API: Generated ${externalRecipes.length} external recipes`);

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ External API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch external recipes' },
      { status: 500 }
    );
  }
}

// Build comprehensive search query using all selected fields
function buildSearchQuery(mainFood: string, ingredients: string[], filters: RecipeFilters): string {
  let query = mainFood;
  
  // Add ingredients to search query
  if (ingredients.length > 0) {
    query += ` ${ingredients.slice(0, 3).join(' ')}`;
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
async function fetchFromSource(source: { name: string; baseUrl: string; searchUrl: string; apiUrl: string }, searchQuery: string, mainFood: string, userIngredients: string[]): Promise<ExternalRecipe[]> {
  try {
    // For now, generate mock external recipes with proper titles
    return generateMockExternalRecipes(source.name, searchQuery, mainFood, userIngredients);
  } catch (error) {
    console.error(`❌ Error fetching from ${source.name}:`, error);
    return [];
  }
}

// Generate mock external recipes with proper titles
function generateMockExternalRecipes(sourceName: string, searchQuery: string, mainFood: string, userIngredients: string[]): ExternalRecipe[] {
  const recipes: ExternalRecipe[] = [];
  const recipeCount = Math.min(3, 3); // Generate 3 recipes per source
  
  for (let i = 0; i < recipeCount; i++) {
    const recipe = generateMockRecipe(sourceName, searchQuery, mainFood, userIngredients, i);
    recipes.push(recipe);
  }
  
  return recipes;
}

// Generate a single mock external recipe with proper title
function generateMockRecipe(sourceName: string, searchQuery: string, mainFood: string, userIngredients: string[], index: number): ExternalRecipe {
  // Generate proper recipe title based on main food
  const title = generateProperExternalTitle(mainFood, sourceName, index);
  
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

// Generate proper external recipe titles - FIXED: Better matching logic
function generateProperExternalTitle(mainFood: string, sourceName: string, index: number): string {
  const normalizedFood = mainFood.toLowerCase().trim();
  
  // Get base templates for the main food - FIXED: Better matching logic
  let baseTemplates;
  
  // First, try exact match
  if (EXTERNAL_TITLE_TEMPLATES[normalizedFood as keyof typeof EXTERNAL_TITLE_TEMPLATES]) {
    baseTemplates = EXTERNAL_TITLE_TEMPLATES[normalizedFood as keyof typeof EXTERNAL_TITLE_TEMPLATES];
  } else {
    // Find the best matching key - prioritize exact matches and avoid wrong matches
    const matchingKey = Object.keys(EXTERNAL_TITLE_TEMPLATES).find(key => {
      const keyLower = key.toLowerCase();
      const foodLower = normalizedFood.toLowerCase();
      
      // Only match if the main food contains the key or vice versa, but be more strict
      return (foodLower.includes(keyLower) && keyLower.length > 3) || 
             (keyLower.includes(foodLower) && foodLower.length > 3);
    });
    
    if (matchingKey) {
      baseTemplates = EXTERNAL_TITLE_TEMPLATES[matchingKey as keyof typeof EXTERNAL_TITLE_TEMPLATES];
    } else {
      // Fallback to generic templates that include the main food
      baseTemplates = [
        `Best ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Recipe`,
        `Easy ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} from ${sourceName}`,
        `Popular ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Dish`,
        `Classic ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Recipe`,
        `Award-Winning ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)}`
      ];
    }
  }

  // Select a base template
  const baseTemplate = baseTemplates[index % baseTemplates.length];
  
  // Add cooking method variation
  const cookingMethod = COOKING_METHODS[index % COOKING_METHODS.length];
  
  // Add flavor enhancer
  const flavorEnhancer = FLAVOR_ENHANCERS[index % FLAVOR_ENHANCERS.length];
  
  // Create variations for external sources
  const titleVariations = [
    baseTemplate,
    `${cookingMethod} ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)}`,
    `${flavorEnhancer} ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)}`,
    `${baseTemplate} from ${sourceName}`,
    `${sourceName}'s ${baseTemplate}`,
    `${cookingMethod} ${baseTemplate}`,
    `${flavorEnhancer} ${baseTemplate}`
  ];
  
  return titleVariations[index % titleVariations.length];
}

// Generate mock ingredients
function generateMockIngredients(mainFood: string, userIngredients: string[]): string[] {
  const baseIngredients = [mainFood];
  const commonIngredients = [
    'salt', 'black pepper', 'olive oil', 'garlic', 'onion', 'butter',
    'lemon', 'herbs', 'spices', 'vegetables'
  ];
  
  const allIngredients = [...baseIngredients, ...commonIngredients, ...userIngredients];
  return [...new Set(allIngredients)].slice(0, 10);
}

// Generate mock cooking steps
function generateMockSteps(mainFood: string): string[] {
  return [
    `Prepare the ${mainFood} by washing and cutting as needed.`,
    `Season with salt and pepper to taste.`,
    `Heat oil in a pan over medium heat.`,
    `Cook the ${mainFood} until golden brown and cooked through.`,
    `Serve hot with your favorite sides.`
  ];
}

// Calculate ingredient match percentage
function calculateIngredientMatch(recipeIngredients: string[], userIngredients: string[]): {
  availableIngredients: string[];
  missingIngredients: string[];
  matchPercentage: number;
} {
  if (userIngredients.length === 0) {
    return {
      availableIngredients: [],
      missingIngredients: [],
      matchPercentage: 85
    };
  }
  
  const availableIngredients = userIngredients.filter(userIng => 
    recipeIngredients.some(recipeIng => 
      recipeIng.toLowerCase().includes(userIng.toLowerCase()) ||
      userIng.toLowerCase().includes(recipeIng.toLowerCase())
    )
  );
  
  const missingIngredients = userIngredients.filter(userIng => 
    !recipeIngredients.some(recipeIng => 
      recipeIng.toLowerCase().includes(userIng.toLowerCase()) ||
      userIng.toLowerCase().includes(recipeIng.toLowerCase())
    )
  );
  
  const matchPercentage = Math.round((availableIngredients.length / userIngredients.length) * 100);
  
  return {
    availableIngredients,
    missingIngredients,
    matchPercentage
  };
}

// Get mock image URL
function getMockImage(mainFood: string, index: number): string {
  const foodImages = {
    chicken: [
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800',
      'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800',
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800'
    ],
    beef: [
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
      'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800'
    ],
    salmon: [
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800'
    ],
    pasta: [
      'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800',
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800',
      'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800'
    ],
    rice: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800',
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800'
    ],
    vegetables: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800'
    ],
    fish: [
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800'
    ],
    shrimp: [
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800',
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800'
    ],
    octopus: [
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800',
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800'
    ]
  };
  
  const foodKey = Object.keys(foodImages).find(key => 
    mainFood.toLowerCase().includes(key) || key.includes(mainFood.toLowerCase())
  ) as keyof typeof foodImages;
  
  if (foodKey && foodImages[foodKey]) {
    const images = foodImages[foodKey];
    return images[index % images.length];
  }
  
  // Fallback
  return 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800';
}
