'use client';

import React, { useState, useEffect } from 'react';
import RecipeCard from '@/components/RecipeCard';
import RecipeModal from '@/components/RecipeModal';
import Link from 'next/link';

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

export default function Home() {
  const [appMode, setAppMode] = useState<AppMode>('generator');
  const [mainFood, setMainFood] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [pantryIngredients, setPantryIngredients] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [mealType, setMealType] = useState('');
  const [dietaryStyle, setDietaryStyle] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [trendingRecipes, setTrendingRecipes] = useState<TrendingRecipe[]>([]);
  const [newlyPostedRecipes, setNewlyPostedRecipes] = useState<TrendingRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchTrendingRecipes();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setUserLoading(false);
    }
  };

  const fetchTrendingRecipes = async () => {
    try {
      const response = await fetch('/api/recipes/trending');
      if (response.ok) {
        const data = await response.json();
        setTrendingRecipes(data.trending);
        setNewlyPostedRecipes(data.newlyPosted);
      }
    } catch (error) {
      console.error('Error fetching trending recipes:', error);
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

    try {
      const response = await fetch('/api/generateRecipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mainFood: mainFood.trim(),
          ingredients: ingredients.split(',').map(ing => ing.trim()).filter(ing => ing),
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
      const response = await fetch('/api/generateRecipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mainFood: mainFood.trim(),
          ingredients: ingredients.split(',').map(ing => ing.trim()).filter(ing => ing),
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Smart Recipe Discovery
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Discover ViralCarrot original recipes and popular recipes from the web. 
            Get ingredient match percentages and find exactly what you can cook with your available ingredients.
          </p>

          {/* Mode Selection */}
          <div className="flex justify-center mb-8">
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

        {/* Trending Recipes Section */}
        {(trendingRecipes.length > 0 || newlyPostedRecipes.length > 0) && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Trending & New Recipes</h3>
            
            {trendingRecipes.length > 0 && (
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-slate-700 mb-4">🔥 Trending This Week</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trendingRecipes.slice(0, 3).map((recipe) => (
                    <div key={recipe.id} className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h5 className="font-semibold text-slate-800 mb-2">{recipe.title}</h5>
                      <p className="text-slate-600 text-sm mb-3">{recipe.description}</p>
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>{recipe.views} views</span>
                        <span>{recipe.likes} likes</span>
                        <span className="text-amber-600 font-medium">{recipe.cuisine}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {newlyPostedRecipes.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-slate-700 mb-4">✨ Just Posted</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {newlyPostedRecipes.slice(0, 3).map((recipe) => (
                    <div key={recipe.id} className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h5 className="font-semibold text-slate-800 mb-2">{recipe.title}</h5>
                      <p className="text-slate-600 text-sm mb-3">{recipe.description}</p>
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>{recipe.views} views</span>
                        <span>{recipe.likes} likes</span>
                        <span className="text-green-600 font-medium">New</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-amber-100 p-6 md:p-8 mb-8">
          {appMode === 'generator' && (
            <>
              <div className="mb-6">
                <label className="block text-xl font-light text-slate-800 mb-4">
                  What&apos;s your main ingredient?
                </label>
                <input
                  type="text"
                  value={mainFood}
                  onChange={(e) => setMainFood(e.target.value)}
                  placeholder="e.g., chicken, salmon, broccoli, pasta..."
                  className="w-full max-w-xl mx-auto p-4 text-lg border-0 border-b-2 border-slate-300 focus:border-amber-500 focus:outline-none text-slate-800 bg-transparent placeholder-slate-400 font-light"
                />
              </div>

              <div className="mb-6">
                <label className="block text-xl font-light text-slate-800 mb-4">
                  Other ingredients you have?
                </label>
                <input
                  type="text"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="e.g., garlic, onions, tomatoes, cheese..."
                  className="w-full max-w-xl mx-auto p-4 text-lg border-0 border-b-2 border-slate-300 focus:border-amber-500 focus:outline-none text-slate-800 bg-transparent placeholder-slate-400 font-light"
                />
                <p className="text-sm text-slate-500 mt-2">
                  Separate ingredients with commas
                </p>
              </div>
            </>
          )}

          {appMode === 'pantry' && (
            <>
              <div className="mb-6">
                <label className="block text-xl font-light text-slate-800 mb-4">
                  What&apos;s in your pantry?
                </label>
                <textarea
                  value={pantryIngredients}
                  onChange={(e) => setPantryIngredients(e.target.value)}
                  placeholder="Enter all your available ingredients (comma separated)... e.g., chicken, rice, onions, garlic, tomatoes, cheese"
                  className="w-full max-w-xl mx-auto p-4 text-lg border-0 border-b-2 border-slate-300 focus:border-amber-500 focus:outline-none resize-none text-slate-800 bg-transparent placeholder-slate-400 font-light"
                  rows={3}
                />
                <p className="text-sm text-slate-500 mt-2">
                  We&apos;ll find existing recipes you can make with these ingredients
                </p>
              </div>
            </>
          )}

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Cooking Time</label>
              <select
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">Any time</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="240">4+ hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Cuisine</label>
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
              <label className="block text-sm font-medium text-slate-700 mb-2">Meal Type</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
              <label className="block text-sm font-medium text-slate-700 mb-2">Dietary Style</label>
              <select
                value={dietaryStyle}
                onChange={(e) => setDietaryStyle(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Recipes...</span>
                </div>
              ) : (
                appMode === 'generator' ? 'Generate Smart Recipes' : 'Find Pantry Recipes'
              )}
            </button>
          </div>
        </div>

        {/* AdSense Ad Placement - Top */}
        <div className="mb-8 text-center">
          <div className="bg-slate-100 rounded-xl p-8 border-2 border-dashed border-slate-300">
            <p className="text-slate-500 text-sm">Advertisement Space</p>
            <p className="text-slate-400 text-xs">Google AdSense will display relevant ads here</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <p className="text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {recipes.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800">
                {appMode === 'generator' ? 'Smart Recipes' : 'Pantry Recipes'}
              </h3>
              <div className="text-sm text-slate-600">
                {recipes.length} of {totalRecipes} recipes
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
            <div className="my-8 text-center">
              <div className="bg-slate-100 rounded-xl p-8 border-2 border-dashed border-slate-300">
                <p className="text-slate-500 text-sm">Advertisement Space</p>
                <p className="text-slate-400 text-xs">Google AdSense will display relevant ads here</p>
              </div>
            </div>

            {/* Load More Button */}
            {showLoadMore && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-white border-2 border-amber-500 text-amber-600 hover:bg-amber-50 font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load More Recipes'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Features Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-amber-100 p-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            Why Choose ViralCarrot?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">Smart Matching</h4>
              <p className="text-slate-600">
                Get ingredient match percentages and see exactly what you can cook with your available ingredients.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">Popular Recipes</h4>
              <p className="text-slate-600">
                Discover trending recipes from popular cooking websites alongside ViralCarrot originals.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">Fast & Reliable</h4>
              <p className="text-slate-600">
                Get instant results with our optimized search and caching system for the best experience.
              </p>
            </div>
          </div>
        </div>

        {/* AdSense Ad Placement - Bottom */}
        <div className="mt-8 text-center">
          <div className="bg-slate-100 rounded-xl p-8 border-2 border-dashed border-slate-300">
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
      <footer className="bg-slate-800 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                <span className="text-xl font-bold">ViralCarrot</span>
              </div>
              <p className="text-slate-300 text-sm">
                Smart recipe discovery with ingredient matching and popular recipes from the web.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>Smart Recipe Generator</li>
                <li>Pantry Wizard</li>
                <li>Ingredient Matching</li>
                <li>Popular Recipes</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><Link href="/about" className="hover:text-amber-400 transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-amber-400 transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-amber-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <p className="text-slate-300 text-sm">
                Get the latest recipes and cooking tips delivered to your inbox.
              </p>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 ViralCarrot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
