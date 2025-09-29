'use client';

import React, { useState, useEffect } from 'react';
import RecipeCard from '@/components/RecipeCard';
import RecipeModal from '@/components/RecipeModal';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type AppMode = 'generator' | 'pantry';

interface Recipe {
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

interface TrendingRecipe {
  id: string;
  title: string;
  image: string;
  description: string;
  ingredients: string[];
  steps: string[];
  cookingTime: number;
  cuisine: string;
  mealType: string;
  dietaryStyle: string;
  views: number;
  likes: number;
  createdAt: string;
  website?: string;
  sourceUrl?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  subscription?: {
    plan: string;
    status: string;
  };
}

// Common ingredients for quick selection
const COMMON_INGREDIENTS = [
  'garlic', 'onion', 'tomato', 'cheese', 'butter', 'olive oil', 
  'salt', 'black pepper', 'lemon', 'herbs', 'mushrooms', 'bell pepper',
  'carrot', 'celery', 'potato', 'rice', 'pasta', 'bread'
];

// Common pantry ingredients for pantry wizard
const COMMON_PANTRY_INGREDIENTS = [
  'chicken', 'beef', 'pork', 'fish', 'shrimp', 'eggs',
  'rice', 'pasta', 'bread', 'potato', 'onion', 'garlic',
  'tomato', 'cheese', 'butter', 'olive oil', 'salt', 'black pepper',
  'lemon', 'herbs', 'mushrooms', 'bell pepper', 'carrot', 'celery',
  'broccoli', 'spinach', 'lettuce', 'cucumber', 'avocado', 'apple',
  'banana', 'orange', 'milk', 'yogurt', 'flour', 'sugar',
  'honey', 'vinegar', 'soy sauce', 'ketchup', 'mustard'
];

export default function Home() {
  const [appMode, setAppMode] = useState<AppMode>('generator');
  const [mainFood, setMainFood] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [pantryIngredients, setPantryIngredients] = useState('');
  const [selectedPantryIngredients, setSelectedPantryIngredients] = useState<string[]>([]);
  const [cookingTime, setCookingTime] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [mealType, setMealType] = useState('');
  const [dietaryStyle, setDietaryStyle] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [trendingRecipes, setTrendingRecipes] = useState<TrendingRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();

  // Fetch user data and trending recipes
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setUserLoading(false);
      }
    };

    const fetchTrendingRecipes = async () => {
      try {
        const response = await fetch('/api/recipes/trending');
        if (response.ok) {
          const data = await response.json();
          setTrendingRecipes(data.recipes);
        }
      } catch (error) {
        console.error('Error fetching trending recipes:', error);
      }
    };

    fetchUser();
    fetchTrendingRecipes();
  }, []);

  const handleIngredientClick = (ingredient: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient) 
        ? prev.filter(ing => ing !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handlePantryIngredientClick = (ingredient: string) => {
    setSelectedPantryIngredients(prev => 
      prev.includes(ingredient) 
        ? prev.filter(ing => ing !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handleGenerateRecipes = async () => {
    if (!mainFood.trim() && selectedIngredients.length === 0 && !ingredients.trim()) {
      setError('Please enter at least one ingredient');
      return;
    }

    setLoading(true);
    setError('');

    // Combine selected ingredients with manually typed ones
    const allIngredients = [...selectedIngredients, ...ingredients.split(',').map(ing => ing.trim()).filter(ing => ing)];

    try {
      const response = await fetch('/api/generateRecipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mainFood: mainFood.trim(),
          ingredients: allIngredients,
          filters: {
            cookingTime,
            cuisine,
            mealType,
            dietaryStyle
          },
          includeExternal: true
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRecipes(data.recipes);
        setTotalRecipes(data.total);
        setShowLoadMore(data.total > 6);
        setError('');
      } else {
        setError(data.error || 'Failed to generate recipes');
      }
    } catch (err) {
      setError('Failed to generate recipes. Please try again.');
      console.error('Error generating recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePantrySearch = async () => {
    if (!pantryIngredients.trim() && selectedPantryIngredients.length === 0) {
      setError('Please enter at least one pantry ingredient');
      return;
    }

    setLoading(true);
    setError('');

    // Combine selected pantry ingredients with manually typed ones
    const allPantryIngredients = [...selectedPantryIngredients, ...pantryIngredients.split(',').map(ing => ing.trim()).filter(ing => ing)];

    try {
      const response = await fetch('/api/pantryWizard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pantryIngredients: allPantryIngredients,
          filters: {
            cookingTime,
            cuisine,
            mealType,
            dietaryStyle
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRecipes(data.recipes);
        setTotalRecipes(data.total);
        setShowLoadMore(data.total > 6);
        setError('');
      } else {
        setError(data.error || 'Failed to find pantry recipes');
      }
    } catch (err) {
      setError('Failed to find pantry recipes. Please try again.');
      console.error('Error finding pantry recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (loading) return;

    setLoading(true);
    setCurrentPage(prev => prev + 1);

    try {
      const allIngredients = [...selectedIngredients, ...ingredients.split(',').map(ing => ing.trim()).filter(ing => ing)];
      
      const response = await fetch('/api/generateRecipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mainFood: mainFood.trim(),
          ingredients: allIngredients,
          filters: {
            cookingTime,
            cuisine,
            mealType,
            dietaryStyle
          },
          includeExternal: true,
          page: currentPage + 1
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRecipes(prev => [...prev, ...data.recipes]);
        setShowLoadMore(recipes.length + data.recipes.length < totalRecipes);
      }
    } catch (err) {
      console.error('Error loading more recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedRecipe(null);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Convert trending recipe to regular recipe for modal
  const handleLatestRecipeClick = (trendingRecipe: TrendingRecipe) => {
    const recipe: Recipe = {
      id: trendingRecipe.id,
      title: trendingRecipe.title,
      image: trendingRecipe.image,
      description: trendingRecipe.description,
      ingredients: trendingRecipe.ingredients,
      steps: trendingRecipe.steps,
      cookingTime: trendingRecipe.cookingTime,
      cuisine: trendingRecipe.cuisine,
      mealType: trendingRecipe.mealType,
      dietaryStyle: trendingRecipe.dietaryStyle,
      tags: [trendingRecipe.cuisine, trendingRecipe.mealType, trendingRecipe.dietaryStyle],
      createdBy: 'Community Member',
      matchScore: 0.9,
      rating: 4.5,
      difficulty: 'Medium',
      servings: 4,
      nutrition: {
        calories: 200 + Math.floor(Math.random() * 300),
        protein: 15 + Math.floor(Math.random() * 20),
        carbs: 20 + Math.floor(Math.random() * 30),
        fat: 5 + Math.floor(Math.random() * 15)
      },
      seoDescription: trendingRecipe.description,
      isExternal: false,
      sourceUrl: trendingRecipe.sourceUrl
    };
    setSelectedRecipe(recipe);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800">ViralCarrot</h1>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/about" className="text-slate-600 hover:text-amber-600 transition-colors">About</Link>
              <Link href="/contact" className="text-slate-600 hover:text-amber-600 transition-colors">Contact</Link>
              <Link href="/privacy" className="text-slate-600 hover:text-amber-600 transition-colors">Privacy</Link>
              {userLoading ? (
                <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              ) : user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-slate-600">Welcome, {user.name}</span>
                  <Link href="/dashboard" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl transition-colors">
                    Dashboard
                  </Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-colors">
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            ViralCarrot
          </h2>
          <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
            Let&apos;s make something delicious with what you have! Simply tell us what ingredients you have, 
            and we&apos;ll find you the perfect recipes from our community and the web.
          </p>

          {/* Mode Selection - Beautiful Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-2xl p-2 shadow-xl border border-amber-100">
              <button
                onClick={() => setAppMode('generator')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 text-sm ${
                  appMode === 'generator'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg transform scale-105'
                    : 'text-slate-600 hover:text-amber-600 hover:bg-amber-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🍳</span>
                  <span>Recipe Generator</span>
                </div>
              </button>
              <button
                onClick={() => setAppMode('pantry')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 text-sm ${
                  appMode === 'pantry'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg transform scale-105'
                    : 'text-slate-600 hover:text-amber-600 hover:bg-amber-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🧺</span>
                  <span>Pantry Wizard</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Beautiful Input Section */}
        <div className="bg-white rounded-3xl shadow-2xl border border-amber-100 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">
                  {appMode === 'generator' ? '🍳' : '🧺'}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {appMode === 'generator' ? 'Smart Recipe Generator' : 'Pantry Wizard'}
                </h3>
                <p className="text-amber-100 text-sm">
                  {appMode === 'generator' 
                    ? 'Tell us your main ingredient and we\'ll create amazing recipes'
                    : 'Enter your pantry ingredients and find what you can cook'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {appMode === 'generator' && (
              <>
                {/* Main Ingredient Input */}
                <div className="mb-8">
                  <label className="block text-lg font-semibold text-slate-800 mb-4">
                    <span className="flex items-center gap-2">
                      <span className="text-2xl">⭐</span>
                      What&apos;s your main ingredient?
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={mainFood}
                      onChange={(e) => setMainFood(e.target.value)}
                      placeholder="e.g., chicken, salmon, broccoli, pasta..."
                      className="w-full p-4 text-lg border-2 border-slate-200 rounded-2xl focus:border-amber-500 focus:outline-none text-slate-800 bg-slate-50 placeholder-slate-400 transition-all duration-200 focus:bg-white focus:shadow-lg"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <span className="text-2xl">🥘</span>
                    </div>
                  </div>
                </div>

                {/* Other Ingredients */}
                <div className="mb-8">
                  <label className="block text-lg font-semibold text-slate-800 mb-4">
                    <span className="flex items-center gap-2">
                      <span className="text-2xl">🥬</span>
                      Other ingredients you have?
                    </span>
                  </label>
                  
                  {/* Quick ingredient selection bubbles */}
                  <div className="mb-6">
                    <p className="text-sm text-slate-600 mb-3 font-medium">Quick select common ingredients:</p>
                    <div className="flex flex-wrap gap-2 justify-center max-w-4xl mx-auto">
                      {COMMON_INGREDIENTS.map((ingredient) => (
                        <button
                          key={ingredient}
                          onClick={() => handleIngredientClick(ingredient)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                            selectedIngredients.includes(ingredient)
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                              : 'bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-700 hover:shadow-md'
                          }`}
                        >
                          {ingredient}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual ingredient input */}
                  <div>
                    <p className="text-sm text-slate-600 mb-3 font-medium">Or type additional ingredients:</p>
                    <div className="relative">
                      <input
                        type="text"
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        placeholder="e.g., garlic, onions, tomatoes, cheese..."
                        className="w-full p-4 text-lg border-2 border-slate-200 rounded-2xl focus:border-amber-500 focus:outline-none text-slate-800 bg-slate-50 placeholder-slate-400 transition-all duration-200 focus:bg-white focus:shadow-lg"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <span className="text-2xl">✏️</span>
                      </div>
                    </div>
                  </div>

                  {/* Selected ingredients display */}
                  {selectedIngredients.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-slate-600 mb-2 font-medium">Selected ingredients:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedIngredients.map((ingredient) => (
                          <span
                            key={ingredient}
                            className="px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full text-sm font-medium border border-amber-200"
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {appMode === 'pantry' && (
              <>
                {/* Pantry Ingredients */}
                <div className="mb-8">
                  <label className="block text-lg font-semibold text-slate-800 mb-4">
                    <span className="flex items-center gap-2">
                      <span className="text-2xl">🧺</span>
                      What&apos;s in your pantry?
                    </span>
                  </label>
                  
                  {/* Quick pantry ingredient selection bubbles */}
                  <div className="mb-6">
                    <p className="text-sm text-slate-600 mb-3 font-medium">Quick select from common pantry items:</p>
                    <div className="flex flex-wrap gap-2 justify-center max-w-5xl mx-auto">
                      {COMMON_PANTRY_INGREDIENTS.map((ingredient) => (
                        <button
                          key={ingredient}
                          onClick={() => handlePantryIngredientClick(ingredient)}
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                            selectedPantryIngredients.includes(ingredient)
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                              : 'bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-700 hover:shadow-md'
                          }`}
                        >
                          {ingredient}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Manual pantry ingredient input */}
                  <div>
                    <p className="text-sm text-slate-600 mb-3 font-medium">Or type additional ingredients:</p>
                    <div className="relative">
                      <textarea
                        value={pantryIngredients}
                        onChange={(e) => setPantryIngredients(e.target.value)}
                        placeholder="Enter all your available ingredients (comma separated)..."
                        className="w-full p-4 text-lg border-2 border-slate-200 rounded-2xl focus:border-amber-500 focus:outline-none resize-none text-slate-800 bg-slate-50 placeholder-slate-400 transition-all duration-200 focus:bg-white focus:shadow-lg"
                        rows={3}
                      />
                      <div className="absolute right-4 top-4">
                        <span className="text-2xl">📝</span>
                      </div>
                    </div>
                  </div>

                  {/* Selected pantry ingredients display */}
                  {selectedPantryIngredients.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-slate-600 mb-2 font-medium">Selected ingredients:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedPantryIngredients.map((ingredient) => (
                          <span
                            key={ingredient}
                            className="px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full text-sm font-medium border border-amber-200"
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Beautiful Filters Section */}
            <div className="bg-gradient-to-r from-slate-50 to-amber-50 rounded-2xl p-6 mb-8">
              <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">⚙️</span>
                Refine Your Search
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">⏰ Cooking Time</label>
                  <select
                    value={cookingTime}
                    onChange={(e) => setCookingTime(e.target.value)}
                    className="w-full p-3 border-2 border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white transition-all duration-200"
                  >
                    <option value="">Any Time</option>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2+ hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">🌍 Cuisine</label>
                  <select
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    className="w-full p-3 border-2 border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white transition-all duration-200"
                  >
                    <option value="">Any Cuisine</option>
                    <option value="italian">Italian</option>
                    <option value="mexican">Mexican</option>
                    <option value="asian">Asian</option>
                    <option value="mediterranean">Mediterranean</option>
                    <option value="indian">Indian</option>
                    <option value="american">American</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">🍽️ Meal Type</label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    className="w-full p-3 border-2 border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white transition-all duration-200"
                  >
                    <option value="">Any Meal</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                    <option value="dessert">Dessert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">🥗 Dietary Style</label>
                  <select
                    value={dietaryStyle}
                    onChange={(e) => setDietaryStyle(e.target.value)}
                    className="w-full p-3 border-2 border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white transition-all duration-200"
                  >
                    <option value="">Any Diet</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="keto">Keto</option>
                    <option value="gluten-free">Gluten-Free</option>
                    <option value="low-carb">Low-Carb</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Beautiful Generate Button */}
            <div className="text-center">
              <button
                onClick={appMode === 'generator' ? handleGenerateRecipes : handlePantrySearch}
                disabled={loading}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg transform hover:scale-105"
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating Amazing Recipes...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {appMode === 'generator' ? '✨' : '🔍'}
                    </span>
                    <span>
                      {appMode === 'generator' ? 'Generate Smart Recipes' : 'Find Pantry Recipes'}
                    </span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* AdSense Ad Placement - Top */}
        <div className="mb-6 text-center">
          <div className="bg-slate-100 rounded-lg p-4 border-2 border-dashed border-slate-300">
            <p className="text-slate-500 text-xs">Advertisement Space</p>
            <p className="text-slate-400 text-xs">Google AdSense will display relevant ads here</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              <p className="text-red-600 text-center font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {recipes.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span className="text-3xl">🍽️</span>
                {appMode === 'generator' ? 'Smart Recipes' : 'Pantry Recipes'}
              </h3>
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 rounded-full">
                <span className="text-sm font-semibold text-amber-800">
                  {recipes.length} of {totalRecipes} recipes
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onSelect={setSelectedRecipe}
                />
              ))}
            </div>

            {/* AdSense Ad Placement - Middle */}
            <div className="my-6 text-center">
              <div className="bg-slate-100 rounded-lg p-4 border-2 border-dashed border-slate-300">
                <p className="text-slate-500 text-xs">Advertisement Space</p>
                <p className="text-slate-400 text-xs">Google AdSense will display relevant ads here</p>
              </div>
            </div>

            {/* Load More Button */}
            {showLoadMore && (
              <div className="text-center mt-6">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load More Recipes'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Latest Community Recipes Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="text-3xl">👥</span>
            Latest Community Recipes
          </h3>
          
          {trendingRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={{
                    id: recipe.id,
                    title: recipe.title,
                    image: recipe.image,
                    description: recipe.description,
                    ingredients: recipe.ingredients,
                    steps: recipe.steps,
                    cookingTime: recipe.cookingTime,
                    cuisine: recipe.cuisine,
                    mealType: recipe.mealType,
                    dietaryStyle: recipe.dietaryStyle,
                    tags: [recipe.cuisine, recipe.mealType, recipe.dietaryStyle],
                    createdBy: 'Community Member',
                    matchScore: 0.9,
                    rating: 4.5,
                    difficulty: 'Medium',
                    servings: 4,
                    nutrition: {
                      calories: 200 + Math.floor(Math.random() * 300),
                      protein: 15 + Math.floor(Math.random() * 20),
                      carbs: 20 + Math.floor(Math.random() * 30),
                      fat: 5 + Math.floor(Math.random() * 15)
                    },
                    seoDescription: recipe.description,
                    isExternal: false,
                    sourceUrl: recipe.sourceUrl
                  }}
                  onSelect={handleLatestRecipeClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <p className="text-slate-600 text-lg">No community recipes available yet</p>
            </div>
          )}
        </div>
      </main>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
