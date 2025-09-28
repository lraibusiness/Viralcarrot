'use client';

import { useState } from 'react';
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
  tags?: string[];
  createdBy?: string;
  rating?: number;
  difficulty?: string;
  servings?: number;
  matchScore?: number;
  seoDescription?: string;
}

interface RecipeFilters {
  cookingTime: string;
  cuisine: string;
  mealType: string;
  dietaryStyle: string;
}

export default function Home() {
  const [mainFood, setMainFood] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [filters, setFilters] = useState<RecipeFilters>({
    cookingTime: '',
    cuisine: '',
    mealType: '',
    dietaryStyle: ''
  });
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleGenerateRecipes = async () => {
    if (!mainFood.trim()) {
      alert('Please enter a main food item');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      console.log('Frontend: Starting recipe generation...');
      console.log('Frontend: Main food:', mainFood);
      console.log('Frontend: Ingredients:', ingredients);
      console.log('Frontend: Filters:', filters);

      const ingredientsArray = ingredients.trim() 
        ? ingredients.split(',').map(ing => ing.trim()).filter(ing => ing.length > 0)
        : [];

      const response = await fetch('/api/generateRecipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mainFood: mainFood.trim(),
          ingredients: ingredientsArray,
          filters: filters
        }),
      });

      console.log('Frontend: Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Frontend: Received data:', data);

      if (data.success && data.recipes) {
        // Limit to maximum 6 recipes
        const limitedRecipes = data.recipes.slice(0, 6);
        setRecipes(limitedRecipes);
        setError(null);
        console.log('Frontend: Successfully set recipes:', limitedRecipes.length);
      } else {
        throw new Error(data.error || 'Invalid response format');
      }
    } catch (error) {
      console.error('Frontend: Error generating recipes:', error);
      console.error('Frontend: Error type:', typeof error);
      console.error('Frontend: Error message:', (error as Error)?.message);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate recipes. Please try again.';
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshRecipes = () => {
    if (hasSearched) {
      handleGenerateRecipes();
    }
  };

  const clearResults = () => {
    setRecipes([]);
    setSelectedRecipe(null);
    setHasSearched(false);
    setError(null);
  };

  const openRecipeModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const closeRecipeModal = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section - Optimized for single viewport */}
      <div className="relative overflow-hidden h-screen flex items-center">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-light text-slate-900 mb-6 tracking-tight">
              ViralCarrot
            </h1>
            <div className="w-20 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-6"></div>
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed font-light">
              Transform your ingredients into <span className="text-amber-600 font-medium">exceptional recipes</span> with our intelligent culinary composer
            </p>
            
            {/* Compact Input Section */}
            <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-slate-200/50">
              <div className="mb-6">
                <label className="block text-xl font-light text-slate-800 mb-4">
                  What is your main ingredient?
                </label>
                <input
                  type="text"
                  value={mainFood}
                  onChange={(e) => setMainFood(e.target.value)}
                  placeholder="e.g., chicken, salmon, vegetables, pasta..."
                  className="w-full max-w-xl mx-auto p-4 text-lg border-0 border-b-2 border-slate-300 focus:border-amber-500 focus:outline-none text-slate-800 bg-transparent placeholder-slate-400 font-light"
                />
              </div>

              <div className="mb-6">
                <label className="block text-base font-light text-slate-700 mb-3">
                  Supporting ingredients (optional)
                </label>
                <textarea
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="Enter supporting ingredients (comma separated)... e.g., garlic, onions, tomatoes, herbs"
                  className="w-full max-w-xl mx-auto p-3 text-base border-0 border-b-2 border-slate-300 focus:border-amber-500 focus:outline-none resize-none text-slate-800 bg-transparent placeholder-slate-400 font-light"
                  rows={2}
                />
              </div>

              {/* Compact Filters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 max-w-3xl mx-auto">
                <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-xl p-3 hover:bg-white/80 transition-all duration-300">
                  <label className="block text-xs font-medium text-slate-700 mb-2">Cooking Time</label>
                  <select
                    value={filters.cookingTime}
                    onChange={(e) => setFilters({...filters, cookingTime: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:border-amber-500 focus:outline-none text-slate-800 bg-white/50 text-sm"
                  >
                    <option value="">Any Time</option>
                    <option value="15">Under 15 min</option>
                    <option value="30">15-30 min</option>
                    <option value="60">30-60 min</option>
                    <option value="120">1-2 hours</option>
                    <option value="240">2+ hours</option>
                  </select>
                </div>

                <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-xl p-3 hover:bg-white/80 transition-all duration-300">
                  <label className="block text-xs font-medium text-slate-700 mb-2">Cuisine</label>
                  <select
                    value={filters.cuisine}
                    onChange={(e) => setFilters({...filters, cuisine: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:border-amber-500 focus:outline-none text-slate-800 bg-white/50 text-sm"
                  >
                    <option value="">Any Cuisine</option>
                    <option value="italian">Italian</option>
                    <option value="mexican">Mexican</option>
                    <option value="asian">Asian</option>
                    <option value="indian">Indian</option>
                    <option value="mediterranean">Mediterranean</option>
                    <option value="american">American</option>
                  </select>
                </div>

                <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-xl p-3 hover:bg-white/80 transition-all duration-300">
                  <label className="block text-xs font-medium text-slate-700 mb-2">Meal Type</label>
                  <select
                    value={filters.mealType}
                    onChange={(e) => setFilters({...filters, mealType: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:border-amber-500 focus:outline-none text-slate-800 bg-white/50 text-sm"
                  >
                    <option value="">Any Meal</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                    <option value="dessert">Dessert</option>
                  </select>
                </div>

                <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-xl p-3 hover:bg-white/80 transition-all duration-300">
                  <label className="block text-xs font-medium text-slate-700 mb-2">Dietary Style</label>
                  <select
                    value={filters.dietaryStyle}
                    onChange={(e) => setFilters({...filters, dietaryStyle: e.target.value})}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:border-amber-500 focus:outline-none text-slate-800 bg-white/50 text-sm"
                  >
                    <option value="">Any Diet</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="keto">Keto</option>
                    <option value="paleo">Paleo</option>
                    <option value="gluten-free">Gluten-Free</option>
                    <option value="dairy-free">Dairy-Free</option>
                  </select>
                </div>
              </div>

              {/* Compact Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={handleGenerateRecipes}
                  disabled={loading || !mainFood.trim()}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-10 py-4 rounded-xl text-base font-medium hover:from-amber-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <span>Generate Recipes</span>
                        <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                {hasSearched && (
                  <button
                    onClick={clearResults}
                    className="bg-gradient-to-r from-slate-500 to-slate-600 text-white px-8 py-4 rounded-xl text-base font-medium hover:from-slate-600 hover:to-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <span>Clear Results</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                )}
              </div>

              {/* Compact Error Display */}
              {error && (
                <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-800 rounded-xl shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-sm">Error</p>
                      <p className="text-xs">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section - Only shows when recipes exist */}
      {recipes.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-light text-slate-900 mb-2">
                Your Recipe Collection
              </h2>
              <p className="text-lg text-slate-600 font-light">
                {recipes.length} exceptional recipes crafted by our culinary intelligence
              </p>
            </div>
            <button
              onClick={handleRefreshRecipes}
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl font-medium hover:from-amber-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => openRecipeModal(recipe)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={closeRecipeModal}
        />
      )}
    </div>
  );
}
