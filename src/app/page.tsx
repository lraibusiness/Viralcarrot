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

export default function Home() {
  const [appMode, setAppMode] = useState<AppMode>('generator');
  const [mainFood, setMainFood] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [pantryIngredients, setPantryIngredients] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [mealType, setMealType] = useState('');
  const [dietaryStyle, setDietaryStyle] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [latestRecipes, setLatestRecipes] = useState<TrendingRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
    fetchLatestRecipes();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        // Removed automatic admin redirect - let admin choose where to go
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setUserLoading(false);
    }
  };

  const fetchLatestRecipes = async () => {
    try {
      const response = await fetch('/api/recipes/trending');
      if (response.ok) {
        const data = await response.json();
        setLatestRecipes(data.recipes || []);
      }
    } catch (error) {
      console.error('Error fetching latest recipes:', error);
    }
  };

  const handleIngredientClick = (ingredient: string) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(prev => prev.filter(ing => ing !== ingredient));
    } else {
      setSelectedIngredients(prev => [...prev, ingredient]);
    }
  };

  const handleGenerateRecipes = async () => {
    if (!mainFood.trim()) {
      setError('Please enter a main food item');
      return;
    }

    setLoading(true);
    setError('');
    setCurrentPage(1);

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
    if (!pantryIngredients.trim()) {
      setError('Please enter at least one pantry ingredient');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/pantryWizard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pantryIngredients: pantryIngredients.split(',').map(ing => ing.trim()).filter(ing => ing),
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Hero Section - Compact for viewport */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
            ViralCarrot
          </h2>
          <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto">
            Let&apos;s make something delicious with what you have! Simply tell us what ingredients you have, 
            and we&apos;ll find you the perfect recipes from our community and the web. No more wondering what to cook!
          </p>

          {/* Mode Selection */}
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-2xl p-2 shadow-lg border border-amber-100">
              <button
                onClick={() => setAppMode('generator')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  appMode === 'generator'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'text-slate-600 hover:text-amber-600'
                }`}
              >
                Recipe Generator
              </button>
              <button
                onClick={() => setAppMode('pantry')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  appMode === 'pantry'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'text-slate-600 hover:text-amber-600'
                }`}
              >
                Pantry Wizard
              </button>
            </div>
          </div>
        </div>

        {/* Input Section - Compact */}
        <div className="bg-white rounded-3xl shadow-xl border border-amber-100 p-4 md:p-6 mb-6">
          {appMode === 'generator' && (
            <>
              <div className="mb-4">
                <label className="block text-lg font-medium text-slate-800 mb-3">
                  What&apos;s your main ingredient?
                </label>
                <input
                  type="text"
                  value={mainFood}
                  onChange={(e) => setMainFood(e.target.value)}
                  placeholder="e.g., chicken, salmon, broccoli, pasta..."
                  className="w-full max-w-xl mx-auto p-3 text-base border-0 border-b-2 border-slate-300 focus:border-amber-500 focus:outline-none text-slate-800 bg-transparent placeholder-slate-400"
                />
              </div>

              <div className="mb-4">
                <label className="block text-lg font-medium text-slate-800 mb-3">
                  Other ingredients you have?
                </label>
                
                {/* Quick ingredient selection bubbles */}
                <div className="mb-3">
                  <p className="text-sm text-slate-500 mb-2">Quick select common ingredients:</p>
                  <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
                    {COMMON_INGREDIENTS.map((ingredient) => (
                      <button
                        key={ingredient}
                        onClick={() => handleIngredientClick(ingredient)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                          selectedIngredients.includes(ingredient)
                            ? 'bg-amber-500 text-white shadow-md'
                            : 'bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-700'
                        }`}
                      >
                        {ingredient}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Manual ingredient input */}
                <div>
                  <p className="text-sm text-slate-500 mb-2">Or type additional ingredients:</p>
                  <input
                    type="text"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="e.g., garlic, onions, tomatoes, cheese..."
                    className="w-full max-w-xl mx-auto p-3 text-base border-0 border-b-2 border-slate-300 focus:border-amber-500 focus:outline-none text-slate-800 bg-transparent placeholder-slate-400"
                  />
                  <p className="text-sm text-slate-500 mt-1">
                    Separate ingredients with commas
                  </p>
                </div>

                {/* Selected ingredients display */}
                {selectedIngredients.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-slate-600 mb-2">Selected ingredients:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {selectedIngredients.map((ingredient) => (
                        <span
                          key={ingredient}
                          className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
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
              <div className="mb-4">
                <label className="block text-lg font-medium text-slate-800 mb-3">
                  What&apos;s in your pantry?
                </label>
                <textarea
                  value={pantryIngredients}
                  onChange={(e) => setPantryIngredients(e.target.value)}
                  placeholder="Enter all your available ingredients (comma separated)... e.g., chicken, rice, onions, garlic, tomatoes, cheese"
                  className="w-full max-w-xl mx-auto p-3 text-base border-0 border-b-2 border-slate-300 focus:border-amber-500 focus:outline-none resize-none text-slate-800 bg-transparent placeholder-slate-400"
                  rows={2}
                />
                <p className="text-sm text-slate-500 mt-1">
                  We&apos;ll find existing recipes you can make with these ingredients
                </p>
              </div>
            </>
          )}

          {/* Filters - Compact */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cooking Time</label>
              <select
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
              >
                <option value="">Any time</option>
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="240">4+ hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cuisine</label>
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
              >
                <option value="">Any cuisine</option>
                <option value="italian">Italian</option>
                <option value="mexican">Mexican</option>
                <option value="asian">Asian</option>
                <option value="mediterranean">Mediterranean</option>
                <option value="indian">Indian</option>
                <option value="american">American</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Meal Type</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
              >
                <option value="">Any meal</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
                <option value="dessert">Dessert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dietary Style</label>
              <select
                value={dietaryStyle}
                onChange={(e) => setDietaryStyle(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
              >
                <option value="">Any diet</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Keto</option>
                <option value="gluten-free">Gluten-Free</option>
                <option value="low-carb">Low-Carb</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center">
            <button
              onClick={appMode === 'generator' ? handleGenerateRecipes : handlePantrySearch}
              disabled={loading}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Recipes...</span>
                </div>
              ) : (
                appMode === 'generator' ? 'Generate Smart Recipes' : 'Find Pantry Recipes'
              )}
            </button>
          </div>
        </div>

        {/* AdSense Ad Placement - Top */}
        <div className="mb-6 text-center">
          <div className="bg-slate-100 rounded-xl p-6 border-2 border-dashed border-slate-300">
            <p className="text-slate-500 text-sm">Advertisement Space</p>
            <p className="text-slate-400 text-xs">Google AdSense will display relevant ads here</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {recipes.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-800">
                {appMode === 'generator' ? 'Smart Recipes' : 'Pantry Recipes'}
              </h3>
              <div className="text-sm text-slate-600">
                {recipes.length} of {totalRecipes} recipes
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <div className="bg-slate-100 rounded-xl p-6 border-2 border-dashed border-slate-300">
                <p className="text-slate-500 text-sm">Advertisement Space</p>
                <p className="text-slate-400 text-xs">Google AdSense will display relevant ads here</p>
              </div>
            </div>

            {/* Load More Button */}
            {showLoadMore && (
              <div className="text-center mt-6">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-white border-2 border-amber-500 text-amber-600 hover:bg-amber-50 font-semibold py-2 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load More Recipes'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Latest Recipes Section */}
        {latestRecipes.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl border border-amber-100 p-6 mb-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">
              Latest Community Recipes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {latestRecipes.slice(0, 6).map((recipe) => (
                <div 
                  key={recipe.id} 
                  className="bg-gray-50 rounded-xl p-3 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleLatestRecipeClick(recipe)}
                >
                  <div className="flex items-center space-x-3">
                    {recipe.image && (
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h5 className="font-semibold text-slate-800 mb-1 text-sm">{recipe.title}</h5>
                      <p className="text-xs text-slate-600 mb-1 line-clamp-2">{recipe.description}</p>
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <span>{recipe.cookingTime} min</span>
                        <span>{recipe.cuisine}</span>
                        <span>{recipe.views} views</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features Section - Compact */}
        <div className="bg-white rounded-3xl shadow-xl border border-amber-100 p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">
            Why Choose ViralCarrot?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">🧠</span>
              </div>
              <h4 className="text-base font-semibold text-slate-800 mb-2">Smart Matching</h4>
              <p className="text-slate-600 text-sm">
                Get ingredient match percentages and see exactly what you can cook with your available ingredients.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">🌐</span>
              </div>
              <h4 className="text-base font-semibold text-slate-800 mb-2">Popular Recipes</h4>
              <p className="text-slate-600 text-sm">
                Discover trending recipes from popular cooking websites alongside ViralCarrot originals.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">⚡</span>
              </div>
              <h4 className="text-base font-semibold text-slate-800 mb-2">Fast & Reliable</h4>
              <p className="text-slate-600 text-sm">
                Get instant results with our optimized search and caching system for the best experience.
              </p>
            </div>
          </div>
        </div>

        {/* AdSense Ad Placement - Bottom */}
        <div className="mt-6 text-center">
          <div className="bg-slate-100 rounded-xl p-6 border-2 border-dashed border-slate-300">
            <p className="text-slate-500 text-sm">Advertisement Space</p>
            <p className="text-slate-400 text-xs">Google AdSense will display relevant ads here</p>
          </div>
        </div>
      </main>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={closeModal}
        />
      )}

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Sign In</h2>
              <button
                onClick={() => setShowAuth(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <Link
                href="/auth/login"
                className="block w-full bg-amber-500 hover:bg-amber-600 text-white py-3 px-4 rounded-xl text-center transition-colors"
              >
                Login / Register
              </Link>
              <button
                onClick={() => setShowAuth(false)}
                className="block w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-xl text-center transition-colors"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">V</span>
                </div>
                <span className="text-lg font-bold">ViralCarrot</span>
              </div>
              <p className="text-slate-300 text-sm">
                Smart recipe discovery with ingredient matching and popular recipes from the web.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Features</h4>
              <ul className="space-y-1 text-sm text-slate-300">
                <li>Smart Recipe Generator</li>
                <li>Pantry Wizard</li>
                <li>Ingredient Matching</li>
                <li>Popular Recipes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-1 text-sm text-slate-300">
                <li><Link href="/about" className="hover:text-amber-400 transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-amber-400 transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-amber-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Connect</h4>
              <p className="text-slate-300 text-sm">
                Get the latest recipes and cooking tips delivered to your inbox.
              </p>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-6 pt-6 text-center text-sm text-slate-400">
            <p>&copy; 2024 ViralCarrot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
