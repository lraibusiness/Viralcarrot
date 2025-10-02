'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import RecipeCard from '@/components/RecipeCard';
import RecipeModal from '@/components/RecipeModal';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type AppMode = 'generator' | 'pantry';

interface Recipe {
  views: number;
  likes: number;
  createdAt: string;
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
  tags: string[];
  createdBy: string;
  matchScore: number;
  views: number;
  likes: number;
  createdAt: string;
}

export default function HomePage() {
  const [appMode, setAppMode] = useState<AppMode>('generator');
  const [mainFood, setMainFood] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [pantryIngredients, setPantryIngredients] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedPantryIngredients, setSelectedPantryIngredients] = useState<string[]>([]);
  const [cookingTime, setCookingTime] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [mealType, setMealType] = useState('');
  const [dietaryStyle, setDietaryStyle] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [trendingRecipes, setTrendingRecipes] = useState<TrendingRecipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<{ id: string; email: string; name: string; role: string; subscription?: string } | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [usage, setUsage] = useState<{ canGenerate: boolean; remaining: number; limit: number } | null>(null);
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const router = useRouter();

  // Memoized common ingredients
  const commonIngredients = useMemo(() => [
    'onion', 'garlic', 'tomato', 'potato', 'carrot', 'bell pepper', 'mushroom',
    'chicken', 'beef', 'pork', 'fish', 'shrimp', 'egg', 'cheese', 'milk',
    'rice', 'pasta', 'bread', 'flour', 'sugar', 'salt', 'pepper', 'oil'
  ], []);

  const commonPantryIngredients = useMemo(() => [
    'rice', 'pasta', 'bread', 'flour', 'sugar', 'salt', 'pepper', 'oil',
    'onion', 'garlic', 'tomato', 'potato', 'carrot', 'bell pepper',
    'chicken', 'beef', 'pork', 'fish', 'shrimp', 'egg', 'cheese', 'milk',
    'canned beans', 'canned tomatoes', 'frozen vegetables', 'spices'
  ], []);

  // Memoized ingredient selection handlers
  const handleIngredientSelect = useCallback((ingredient: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient) 
        ? prev.filter(ing => ing !== ingredient)
        : [...prev, ingredient]
    );
  }, []);

  const handlePantryIngredientSelect = useCallback((ingredient: string) => {
    setSelectedPantryIngredients(prev => 
      prev.includes(ingredient) 
        ? prev.filter(ing => ing !== ingredient)
        : [...prev, ingredient]
    );
  }, []);

  // Optimized fetch functions
  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        // Fetch total usage after user data is loaded
        const usageResponse = await fetch('/api/user/usage');
        if (usageResponse.ok) {
          const usageData = await usageResponse.json();
          setUsage(usageData.usage);
        }
      } else if (response.status === 401) {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      router.push('/auth/login');
    } finally {
      setUserLoading(false);
    }
  }, [router]);

  const fetchTrendingRecipes = useCallback(async () => {
    try {
      const response = await fetch('/api/recipes/trending');
      if (response.ok) {
        const data = await response.json();
        setTrendingRecipes(data.recipes || []);
      }
    } catch (error) {
      console.error('Error fetching trending recipes:', error);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchTrendingRecipes();
  }, [fetchUserData, fetchTrendingRecipes]);

  const handleGenerateRecipes = useCallback(async () => {
    if (!mainFood.trim()) {
      setError('Please enter a main ingredient');
      return;
    }

    if (user && usage && !usage.canGenerate) {
      setShowLimitPopup(true);
      setLoading(false);
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
  }, [mainFood, ingredients, selectedIngredients, cookingTime, cuisine, mealType, dietaryStyle, user, usage]);

  const handlePantrySearch = useCallback(async () => {
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
  }, [pantryIngredients, selectedPantryIngredients, cookingTime, cuisine, mealType, dietaryStyle]);

  const handleLoadMore = useCallback(async () => {
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
        setShowLoadMore(data.total > (currentPage + 1) * 6);
      }
    } catch (err) {
      console.error('Error loading more recipes:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, currentPage, selectedIngredients, ingredients, mainFood, cookingTime, cuisine, mealType, dietaryStyle]);

  const handleRecipeClick = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedRecipe(null);
  }, []);

  const handleAuthSuccess = useCallback(() => {
    setShowAuth(false);
    fetchUserData();
  }, [fetchUserData]);

  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setUsage(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [router]);

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800">ViralCarrot</h1>
            </Link>
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/blog" className="text-slate-600 hover:text-amber-600 transition-colors text-sm">Blog</Link>
                <Link href="/about" className="text-slate-600 hover:text-amber-600 transition-colors text-sm">About</Link>
                <Link href="/contact" className="text-slate-600 hover:text-amber-600 transition-colors text-sm">Contact</Link>
                <Link href="/privacy" className="text-slate-600 hover:text-amber-600 transition-colors text-sm">Privacy</Link>
                {user ? (
                  <>
                    <Link href="/dashboard" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl transition-colors text-sm">
                      Dashboard
                    </Link>
                    {user.role === 'admin' && (
                      <Link href="/admin" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-colors text-sm">
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-colors text-sm"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowAuth(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl transition-colors text-sm"
                  >
                    Login
                  </button>
                )}
              </div>

              {/* Mobile Navigation */}
              <MobileNav 
                user={user}
                onLogin={() => setShowAuth(true)}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-4 md:mb-8">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-slate-800 mb-1 md:mb-2">
            Viral Carrot
          </h2>
          <p className="text-xs md:text-base text-slate-600 mb-2 md:mb-4 max-w-xl mx-auto px-4">
            Let's make something delicious with what you have!
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-4 md:mb-6">
          <div className="bg-slate-100 p-0.5 md:p-1 rounded-lg md:rounded-xl w-full max-w-sm md:max-w-md">
            <button
              onClick={() => setAppMode('generator')}
              className={`w-1/2 px-2 md:px-4 py-1.5 md:py-2 rounded-md md:rounded-lg font-medium transition-all duration-200 text-xs md:text-sm ${
                appMode === 'generator'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Recipe Generator
            </button>
            <button
              onClick={() => setAppMode('pantry')}
              className={`w-1/2 px-2 md:px-4 py-1.5 md:py-2 rounded-md md:rounded-lg font-medium transition-all duration-200 text-xs md:text-sm ${
                appMode === 'pantry'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Pantry Wizard
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-amber-100 overflow-hidden max-w-5xl mx-auto">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 md:p-3 text-center">
            <div className="flex items-center justify-center gap-2">
              <div>
                <h3 className="text-xs md:text-base font-bold text-white">
                  {appMode === 'generator' ? 'Smart Recipe Generator' : 'Pantry Wizard'}
                </h3>
                <p className="text-amber-100 text-xs hidden md:block">
                  {appMode === 'generator' 
                    ? 'Tell us your main ingredient and we\'ll create amazing recipes'
                    : 'Enter your pantry ingredients and find what you can cook'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 md:p-6">
            {appMode === 'generator' ? (
              <>
                <div className="mb-3 md:mb-4">
                  <label className="block text-xs md:text-sm font-semibold text-slate-800 mb-1">
                    Main Ingredient *
                  </label>
                  <input
                    type="text"
                    value={mainFood}
                    onChange={(e) => setMainFood(e.target.value)}
                    className="w-full p-2 md:p-2.5 text-xs md:text-sm border-2 border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none text-slate-800 bg-slate-50 placeholder-slate-400 transition-all duration-200 focus:bg-white"
                    placeholder="e.g., chicken, salmon, tofu"
                  />
                </div>

                <div className="mb-3 md:mb-4">
                  <label className="block text-xs md:text-sm font-semibold text-slate-800 mb-1">
                    Other Ingredients
                  </label>
                  <div className="flex flex-wrap gap-1 md:gap-1.5 mb-2">
                    {commonIngredients.slice(0, 8).map((ingredient) => (
                      <button
                        key={ingredient}
                        onClick={() => handleIngredientSelect(ingredient)}
                        className={`px-2 md:px-2.5 py-0.5 md:py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                          selectedIngredients.includes(ingredient)
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                            : 'bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-700'
                        }`}
                      >
                        {ingredient}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    className="w-full p-2 md:p-2.5 text-xs md:text-sm border-2 border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none text-slate-800 bg-slate-50 placeholder-slate-400 transition-all duration-200 focus:bg-white"
                    rows={2}
                    placeholder="Add more ingredients"
                  />
                </div>
              </>
            ) : (
              <div className="mb-3 md:mb-4">
                <label className="block text-xs md:text-sm font-semibold text-slate-800 mb-1">
                  What's in Your Pantry?
                </label>
                <div className="flex flex-wrap gap-1 md:gap-1.5 mb-2">
                  {commonPantryIngredients.slice(0, 8).map((ingredient) => (
                    <button
                      key={ingredient}
                      onClick={() => handlePantryIngredientSelect(ingredient)}
                      className={`px-2 md:px-2.5 py-0.5 md:py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                        selectedPantryIngredients.includes(ingredient)
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-amber-100 hover:text-amber-700'
                      }`}
                    >
                      {ingredient}
                    </button>
                  ))}
                </div>
                <textarea
                  value={pantryIngredients}
                  onChange={(e) => setPantryIngredients(e.target.value)}
                  className="w-full p-2 md:p-2.5 text-xs md:text-sm border-2 border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none text-slate-800 bg-slate-50 placeholder-slate-400 transition-all duration-200 focus:bg-white"
                  rows={2}
                  placeholder="Add more pantry ingredients"
                />
              </div>
            )}

                        {/* Filters */}
            <div className="mb-3 md:mb-4">
              <h4 className="text-xs md:text-sm font-semibold text-slate-800 mb-1 md:mb-2">Refine Your Search</h4>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Time</label>
                  <select
                    value={cookingTime}
                    onChange={(e) => setCookingTime(e.target.value)}
                    className="w-full p-1.5 md:p-2 border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="">Any</option>
                    <option value="15">15min</option>
                    <option value="30">30min</option>
                    <option value="60">1hr</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Cuisine</label>
                  <select
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    className="w-full p-1.5 md:p-2 border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="">Any</option>
                    <option value="Italian">Italian</option>
                    <option value="Mexican">Mexican</option>
                    <option value="Asian">Asian</option>
                    <option value="American">American</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Meal</label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    className="w-full p-1.5 md:p-2 border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="">Any</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Diet</label>
                  <select
                    value={dietaryStyle}
                    onChange={(e) => setDietaryStyle(e.target.value)}
                    className="w-full p-1.5 md:p-2 border border-slate-300 rounded-lg text-xs text-slate-800"
                  >
                    <option value="">Any</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Keto">Keto</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="text-center">
              <button
                onClick={appMode === 'generator' ? handleGenerateRecipes : handlePantrySearch}
                disabled={loading}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-2 md:py-2.5 px-4 md:px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
              >
                {loading ? 'Generating...' : appMode === 'generator' ? 'Generate Recipes' : 'Find Recipes'}
              </button>
            </div>
          </div>
        </div>

        {/* Advertisement Space - Top */}
        <div className="mt-8 mb-6">
          <div className="bg-slate-100 rounded-xl p-6 border-2 border-dashed border-slate-300 text-center">
            <p className="text-slate-500 text-sm font-medium">Advertisement Space</p>
            <p className="text-slate-400 text-xs mt-1">Google AdSense compatible - Ads will display here</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-center text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Results */}
        {recipes.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                {appMode === 'generator' ? 'Generated Recipes' : 'Pantry Recipes'} ({recipes.length})
              </h3>
              {showLoadMore && (
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => handleRecipeClick(recipe)}
                />
              ))}
            </div>

            {/* Advertisement Space - After Results */}
            <div className="mt-8">
              <div className="bg-slate-100 rounded-xl p-6 border-2 border-dashed border-slate-300 text-center">
                <p className="text-slate-500 text-sm font-medium">Advertisement Space</p>
                <p className="text-slate-400 text-xs mt-1">Google AdSense compatible - Ads will display here</p>
              </div>
            </div>
          </div>
        )}

        {/* Latest Community Recipes */}
        {trendingRecipes.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Latest Community Recipes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingRecipes.slice(0, 6).map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => handleRecipeClick(recipe)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Auth Modal */}
        {showAuth && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-800">
                  {authMode === 'login' ? 'Login' : 'Register'}
                </h2>
                <button
                  onClick={() => setShowAuth(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              {authMode === 'login' ? (
                <LoginForm onSuccess={handleAuthSuccess} onSwitchToRegister={() => setAuthMode('register')} />
              ) : (
                <RegisterForm onSuccess={handleAuthSuccess} onSwitchToLogin={() => setAuthMode('login')} />
              )}
            </div>
          </div>
        )}

        {/* Lifetime Limit Popup */}
        {showLimitPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center relative">
              <button
                onClick={() => setShowLimitPopup(false)}
                className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-600 text-xl">×</span>
              </button>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">You've reached your lifetime recipe limit 🍲</h2>
              <p className="text-slate-600 mb-6">
                You've generated {usage?.limit} recipes. Upgrade to ViralCarrot Pro for unlimited recipes and premium tools.
              </p>
              <Link href="/premium" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Go Premium
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={handleCloseModal}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
