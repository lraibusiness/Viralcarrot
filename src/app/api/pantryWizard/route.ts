import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
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
  pantryMatch: {
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

// Enhanced recipe title templates for pantry recipes
const PANTRY_TITLE_TEMPLATES = {
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

export async function POST(request: NextRequest) {
  try {
    console.log('🍳 Pantry Wizard API: Starting pantry recipe search');
    
    const body = await request.json();
    const { pantryIngredients = [], filters = {} } = body;

    console.log('📝 Pantry API: Received request:', { pantryIngredients, filters });

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
      console.log('⚡ Pantry API: Returning cached result');
      return NextResponse.json(cachedResult);
    }

    // Find existing recipes based on pantry ingredients
    const existingRecipes = await fetchExistingRecipes(pantryIngredients, filters as RecipeFilters);
    
    console.log(`📊 Pantry API: Found ${existingRecipes.length} matching recipes`);

    const result = {
      success: true,
      recipes: existingRecipes,
      total: existingRecipes.length,
      pantryIngredients,
      matchSummary: {
        highMatch: existingRecipes.filter(r => r.pantryMatch.matchPercentage >= 80).length,
        mediumMatch: existingRecipes.filter(r => r.pantryMatch.matchPercentage >= 60 && r.pantryMatch.matchPercentage < 80).length,
        lowMatch: existingRecipes.filter(r => r.pantryMatch.matchPercentage < 60).length
      }
    };

    // Cache the result
    cache.set(cacheKey, result);
    console.log(`✅ Pantry API: Generated ${existingRecipes.length} pantry recipes`);

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Pantry API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to find pantry recipes' },
      { status: 500 }
    );
  }
}

// Fetch existing recipes from multiple sources
async function fetchExistingRecipes(pantryIngredients: string[], filters: RecipeFilters): Promise<PantryRecipe[]> {
  const allRecipes: PantryRecipe[] = [];
  
  try {
    // Get main ingredients from pantry
    const mainIngredients = pantryIngredients.slice(0, 3); // Use first 3 as main ingredients
    
    // Fetch from multiple sources in parallel
    const sourcePromises = mainIngredients.map(ingredient => 
      Promise.allSettled([
        searchTheMealDB(ingredient, filters),
        searchRecipePuppy(ingredient, pantryIngredients)
      ])
    );

    const results = await Promise.allSettled(sourcePromises);
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const [mealDBResult, recipePuppyResult] = result.value;
        
        if (mealDBResult.status === 'fulfilled') {
          allRecipes.push(...mealDBResult.value);
        }
        if (recipePuppyResult.status === 'fulfilled') {
          allRecipes.push(...recipePuppyResult.value);
        }
        
        console.log(`✅ Pantry Source ${index + 1} completed: ${allRecipes.length} recipes`);
      } else {
        console.warn(`⚠️ Pantry Source ${index + 1} failed:`, result.reason);
      }
    });

    // Remove duplicates and sort by match percentage
    const uniqueRecipes = removeDuplicateRecipes(allRecipes);
    const sortedRecipes = uniqueRecipes
      .sort((a, b) => b.pantryMatch.matchPercentage - a.pantryMatch.matchPercentage)
      .slice(0, 12); // Limit to 12 recipes

    return sortedRecipes;

  } catch (error) {
    console.error('❌ Error fetching pantry recipes:', error);
    return [];
  }
}

// Remove duplicate recipes
function removeDuplicateRecipes(recipes: PantryRecipe[]): PantryRecipe[] {
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

// Search TheMealDB API
async function searchTheMealDB(mainFood: string, filters: RecipeFilters): Promise<PantryRecipe[]> {
  try {
    const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mainFood}`);
    
    if (!response.data.meals) {
      return [];
    }

    const recipes: PantryRecipe[] = [];
    
    for (let i = 0; i < Math.min(3, response.data.meals.length); i++) {
      const meal = response.data.meals[i];
      const ingredients = extractMealDBIngredients(meal);
      
      // Generate proper title
      const title = generateProperPantryTitle(mainFood, 'TheMealDB', i);
      
      const pantryMatch = calculatePantryMatch({
        id: meal.idMeal,
        title: title,
        ingredients: ingredients,
        steps: [meal.strInstructions || 'Follow the recipe instructions.'],
        cookingTime: 30,
        source: 'TheMealDB'
      }, []);

      const recipe: PantryRecipe = {
        id: `themealdb-${meal.idMeal}`,
        title,
        image: meal.strMealThumb || '',
        description: `A delicious ${mainFood} recipe from TheMealDB. This recipe has been tried and tested by home cooks worldwide.`,
        ingredients,
        steps: [meal.strInstructions || 'Follow the recipe instructions.'],
        cookingTime: 30 + Math.floor(Math.random() * 30),
        cuisine: meal.strArea || 'International',
        mealType: 'Dinner',
        dietaryStyle: 'Regular',
        tags: [meal.strArea?.toLowerCase() || 'international', 'dinner', 'themealdb'],
        createdBy: 'TheMealDB',
        matchScore: pantryMatch.matchPercentage / 100,
        rating: 4.0 + Math.random() * 1.0,
        difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
        servings: 4 + Math.floor(Math.random() * 4),
        nutrition: {
          calories: 200 + Math.floor(Math.random() * 400),
          protein: 15 + Math.floor(Math.random() * 25),
          carbs: 20 + Math.floor(Math.random() * 40),
          fat: 8 + Math.floor(Math.random() * 20)
        },
        pantryMatch,
        isExternal: true,
        sourceUrl: `https://www.themealdb.com/meal/${meal.idMeal}`
      };

      recipes.push(recipe);
    }

    return recipes;
  } catch (error) {
    console.error('❌ TheMealDB search error:', error);
    return [];
  }
}

// Search RecipePuppy API
async function searchRecipePuppy(mainFood: string, pantryIngredients: string[]): Promise<PantryRecipe[]> {
  try {
    const response = await axios.get(`http://www.recipepuppy.com/api/?q=${mainFood}`);
    
    if (!response.data.results) {
      return [];
    }

    const recipes: PantryRecipe[] = [];
    
    for (let i = 0; i < Math.min(3, response.data.results.length); i++) {
      const result = response.data.results[i];
      
      // Generate proper title
      const title = generateProperPantryTitle(mainFood, 'RecipePuppy', i);
      
      const pantryMatch = calculatePantryMatch({
        id: `recipepuppy-${i}`,
        title: title,
        ingredients: result.ingredients ? result.ingredients.split(', ') : [],
        steps: ['Follow the recipe instructions from the source.'],
        cookingTime: 30,
        source: 'RecipePuppy'
      }, pantryIngredients);

      const recipe: PantryRecipe = {
        id: `recipepuppy-${Date.now()}-${i}`,
        title,
        image: result.thumbnail || '',
        description: `A popular ${mainFood} recipe from RecipePuppy. This recipe has been collected from various cooking websites.`,
        ingredients: result.ingredients ? result.ingredients.split(', ') : [],
        steps: ['Follow the recipe instructions from the source.'],
        cookingTime: 30 + Math.floor(Math.random() * 30),
        cuisine: 'International',
        mealType: 'Dinner',
        dietaryStyle: 'Regular',
        tags: ['international', 'dinner', 'recipepuppy'],
        createdBy: 'RecipePuppy',
        matchScore: pantryMatch.matchPercentage / 100,
        rating: 3.5 + Math.random() * 1.5,
        difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
        servings: 4 + Math.floor(Math.random() * 4),
        nutrition: {
          calories: 200 + Math.floor(Math.random() * 400),
          protein: 15 + Math.floor(Math.random() * 25),
          carbs: 20 + Math.floor(Math.random() * 40),
          fat: 8 + Math.floor(Math.random() * 20)
        },
        pantryMatch,
        isExternal: true,
        sourceUrl: result.href
      };

      recipes.push(recipe);
    }

    return recipes;
  } catch (error) {
    console.error('❌ RecipePuppy search error:', error);
    return [];
  }
}

// Generate proper pantry recipe titles
function generateProperPantryTitle(mainFood: string, sourceName: string, index: number): string {
  const normalizedFood = mainFood.toLowerCase().trim();
  
  // Get base templates for the main food
  const baseTemplates = PANTRY_TITLE_TEMPLATES[normalizedFood as keyof typeof PANTRY_TITLE_TEMPLATES] || 
    PANTRY_TITLE_TEMPLATES[Object.keys(PANTRY_TITLE_TEMPLATES).find(key => 
      normalizedFood.includes(key) || key.includes(normalizedFood)
    ) as keyof typeof PANTRY_TITLE_TEMPLATES] || 
    [
      `Best ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Recipe`,
      `Easy ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} from ${sourceName}`,
      `Popular ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Dish`,
      `Classic ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} Recipe`,
      `Award-Winning ${mainFood.charAt(0).toUpperCase() + mainFood.slice(1)}`
    ];

  // Select a base template
  const baseTemplate = baseTemplates[index % baseTemplates.length];
  
  // Add cooking method variation
  const cookingMethod = COOKING_METHODS[index % COOKING_METHODS.length];
  
  // Add flavor enhancer
  const flavorEnhancer = FLAVOR_ENHANCERS[index % FLAVOR_ENHANCERS.length];
  
  // Create variations for pantry recipes
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

// Calculate pantry match percentage
function calculatePantryMatch(recipe: ExternalRecipe, pantryIngredients: string[]): {
  availableIngredients: string[];
  missingIngredients: string[];
  matchPercentage: number;
} {
  if (pantryIngredients.length === 0) {
    return {
      availableIngredients: [],
      missingIngredients: [],
      matchPercentage: 85
    };
  }
  
  const availableIngredients = pantryIngredients.filter(pantryIng => 
    recipe.ingredients.some(recipeIng => 
      recipeIng.toLowerCase().includes(pantryIng.toLowerCase()) ||
      pantryIng.toLowerCase().includes(recipeIng.toLowerCase())
    )
  );
  
  const missingIngredients = pantryIngredients.filter(pantryIng => 
    !recipe.ingredients.some(recipeIng => 
      recipeIng.toLowerCase().includes(pantryIng.toLowerCase()) ||
      pantryIng.toLowerCase().includes(recipeIng.toLowerCase())
    )
  );
  
  const matchPercentage = Math.round((availableIngredients.length / pantryIngredients.length) * 100);
  
  return {
    availableIngredients,
    missingIngredients,
    matchPercentage
  };
}

// Extract ingredients from TheMealDB meal object
function extractMealDBIngredients(meal: unknown): string[] {
  const ingredients: string[] = [];
  
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    
    if (ingredient && ingredient.trim()) {
      const fullIngredient = measure ? `${measure} ${ingredient}` : ingredient;
      ingredients.push(fullIngredient.trim());
    }
  }
  
  return ingredients;
}
