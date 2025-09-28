'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RecipeCard from '@/components/RecipeCard';
import RecipeModal from '@/components/RecipeModal';

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
  pantryMatch?: {
    matchPercentage: number;
    availableIngredients: string[];
    missingIngredients: string[];
  };
}

interface TrendingRecipe {
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
  rating?: number;
  difficulty?: string;
  servings?: number;
  views: number;
  likes: number;
  createdAt: string;
}

export default function HomePage() {
  const [mainFood, setMainFood] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [filters, setFilters] = useState({
    cookingTime: '',
    cuisine: '',
    mealType: '',
    dietaryStyle: ''
  });
  const [mode, setMode] = useState<'generate' | 'pantry'>('generate');
  const [pantryIngredients, setPantryIngredients] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [latestRecipes, setLatestRecipes] = useState<TrendingRecipe[]>([]);
  const [userLoading, setUserLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchLatestRecipes();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (!response.ok) {
        // User not authenticated, that's fine for homepage
      }
    } catch (error) {
      // User not authenticated, that's fine for homepage
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
      console.error('Failed to fetch latest recipes:', error);
    }
  };

  const handleGenerateRecipes = async () => {
    if (!mainFood.trim()) {
      setError('Please enter a main food item');
      return;
    }

    setLoading(true);
    setError(null);
    setRecipes([]);
    setPage(1);

    try {
      const ingredientsList = ingredients
        .split(',')
        .map(ing => ing.trim())
        .filter(Boolean);

      const response = await fetch('/api/generateRecipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mainFood,
          ingredients: ingredientsList,
          filters,
          includeExternal: true,
          page: 1
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRecipes(data.recipes || []);
        setHasMore(data.hasMore || false);
      } else {
        setError(data.error || 'Failed to generate recipes');
      }
    } catch (error) {
      console.error('Error generating recipes:', error);
      setError('Failed to generate recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePantrySearch = async () => {
    if (!pantryIngredients.trim()) {
      setError('Please enter your pantry ingredients');
      return;
    }

    setLoading(true);
    setError(null);
    setRecipes([]);
    setPage(1);

    try {
      const ingredientsList = pantryIngredients
        .split(',')
        .map(ing => ing.trim())
        .filter(Boolean);

      const response = await fetch('/api/pantryWizard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pantryIngredients: ingredientsList,
          filters
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRecipes(data.recipes || []);
      } else {
        setError(data.error || 'Failed to find pantry recipes');
      }
    } catch (error) {
      console.error('Error searching pantry:', error);
      setError('Failed to search pantry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    const nextPage = page + 1;

    try {
      const ingredientsList = ingredients
        .split(',')
        .map(ing => ing.trim())
        .filter(Boolean);

      const response = await fetch('/api/generateRecipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mainFood,
          ingredients: ingredientsList,
          filters,
          includeExternal: true,
          page: nextPage
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRecipes(prev => [...prev, ...(data.recipes || [])]);
        setHasMore(data.hasMore || false);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecipe(null);
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-amber-800">ViralCarrot</h1>
            </div>
            <div className="flex items-center space-x-4">
              {!userLoading && (
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 text-sm text-amber-700 hover:text-amber-900 border border-amber-300 rounded-md hover:bg-amber-50 transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover Amazing
            <span className="text-amber-600"> Recipes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Find the perfect recipe based on your ingredients, dietary preferences, and cooking time. 
            From quick weeknight meals to elaborate weekend feasts.
          </p>
        </div>

        {/* Mode Selection */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <button
              onClick={() => setMode('generate')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'generate'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Recipe Generator
            </button>
            <button
              onClick={() => setMode('pantry')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'pantry'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pantry Wizard
            </button>
          </div>
        </div>

        {/* Recipe Generator Form */}
        {mode === 'generate' && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              What would you like to cook?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Ingredient *
                </label>
                <input
                  type="text"
                  value={mainFood}
                  onChange={(e) => setMainFood(e.target.value)}
                  placeholder="e.g., chicken, salmon, pasta, vegetables"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supporting Ingredients
                </label>
                <input
                  type="text"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="e.g., garlic, onions, tomatoes (comma-separated)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cooking Time
                </label>
                <select
                  value={filters.cookingTime}
                  onChange={(e) => setFilters(prev => ({ ...prev, cookingTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Any Time</option>
                  <option value="15">Quick (15 min)</option>
                  <option value="30">Medium (30 min)</option>
                  <option value="60">Long (60+ min)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuisine
                </label>
                <select
                  value={filters.cuisine}
                  onChange={(e) => setFilters(prev => ({ ...prev, cuisine: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Any Cuisine</option>
                  <option value="italian">Italian</option>
                  <option value="asian">Asian</option>
                  <option value="mexican">Mexican</option>
                  <option value="mediterranean">Mediterranean</option>
                  <option value="indian">Indian</option>
                  <option value="american">American</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Type
                </label>
                <select
                  value={filters.mealType}
                  onChange={(e) => setFilters(prev => ({ ...prev, mealType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dietary Style
                </label>
                <select
                  value={filters.dietaryStyle}
                  onChange={(e) => setFilters(prev => ({ ...prev, dietaryStyle: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Any Diet</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="gluten-free">Gluten-Free</option>
                  <option value="keto">Keto</option>
                  <option value="low-carb">Low-Carb</option>
                </select>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleGenerateRecipes}
                disabled={loading}
                className="px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Generating Recipes...' : 'Generate Recipes'}
              </button>
            </div>
          </div>
        )}

        {/* Pantry Wizard Form */}
        {mode === 'pantry' && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              What&apos;s in your pantry?
            </h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pantry Ingredients *
              </label>
              <input
                type="text"
                value={pantryIngredients}
                onChange={(e) => setPantryIngredients(e.target.value)}
                placeholder="e.g., chicken, rice, tomatoes, garlic, onions (comma-separated)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div className="text-center">
              <button
                onClick={handlePantrySearch}
                disabled={loading}
                className="px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Finding Recipes...' : 'Find Recipes'}
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Results */}
        {recipes.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {mode === 'generate' ? 'Generated Recipes' : 'Pantry Recipes'} ({recipes.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => handleRecipeClick(recipe)}
                  pantryMode={mode === 'pantry'}
                />
              ))}
            </div>
            
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Latest Recipes Section */}
        {latestRecipes.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Latest Community Recipes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestRecipes.map((recipe) => (
                <div key={recipe.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-4">
                    {recipe.image && (
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{recipe.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{recipe.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
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
      </div>

      {/* Recipe Modal */}
      {showModal && selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
