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
        setRecipes(data.recipes);
        setError(null);
        console.log('Frontend: Successfully set recipes:', data.recipes.length);
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

  const handleSurpriseMe = () => {
    const surpriseCombinations = [
      { main: 'chicken', ingredients: 'rice, vegetables, garlic' },
      { main: 'pasta', ingredients: 'tomatoes, cheese, basil' },
      { main: 'eggs', ingredients: 'bread, milk, cheese' },
      { main: 'beef', ingredients: 'potatoes, onions, carrots' },
      { main: 'salmon', ingredients: 'quinoa, spinach, lemon' },
      { main: 'prawns', ingredients: 'garlic, butter, wine' },
      { main: 'tofu', ingredients: 'vegetables, soy sauce, ginger' },
      { main: 'vegetables', ingredients: 'quinoa, olive oil, herbs' }
    ];
    const random = surpriseCombinations[Math.floor(Math.random() * surpriseCombinations.length)];
    setMainFood(random.main);
    setIngredients(random.ingredients);
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              🥕 ViralCarrot
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your ingredients into <span className="text-orange-600 font-bold">viral-worthy recipes</span> with our Smart Recipe Composer
            </p>
            
            {/* Enhanced Input Section */}
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="mb-8">
                <label className="block text-2xl font-bold text-gray-800 mb-6">
                  🍽️ What&apos;s your main food item?
                </label>
                <input
                  type="text"
                  value={mainFood}
                  onChange={(e) => setMainFood(e.target.value)}
                  placeholder="e.g., chicken, pasta, salmon, vegetables..."
                  className="w-full max-w-2xl mx-auto p-6 text-xl border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:outline-none text-black shadow-lg"
                />
              </div>

              <div className="mb-8">
                <label className="block text-xl font-semibold text-gray-700 mb-4">
                  🥘 Supporting ingredients (optional)
                </label>
                <textarea
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="Enter supporting ingredients (comma separated)... e.g., garlic, onions, tomatoes, cheese, herbs"
                  className="w-full max-w-2xl mx-auto p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none resize-none text-black"
                  rows={3}
                />
              </div>

              {/* Enhanced Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-orange-500 transition-all duration-300 hover:shadow-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">⏱️ Cooking Time</label>
                  <select
                    value={filters.cookingTime}
                    onChange={(e) => setFilters({...filters, cookingTime: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-black"
                  >
                    <option value="">Any Time</option>
                    <option value="15">Under 15 min</option>
                    <option value="30">15-30 min</option>
                    <option value="60">30-60 min</option>
                    <option value="120">1-2 hours</option>
                    <option value="240">2+ hours</option>
                  </select>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-orange-500 transition-all duration-300 hover:shadow-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">🌍 Cuisine</label>
                  <select
                    value={filters.cuisine}
                    onChange={(e) => setFilters({...filters, cuisine: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-black"
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

                <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-orange-500 transition-all duration-300 hover:shadow-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">🍽️ Meal Type</label>
                  <select
                    value={filters.mealType}
                    onChange={(e) => setFilters({...filters, mealType: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-black"
                  >
                    <option value="">Any Meal</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                    <option value="dessert">Dessert</option>
                  </select>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-orange-500 transition-all duration-300 hover:shadow-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">🥗 Dietary Style</label>
                  <select
                    value={filters.dietaryStyle}
                    onChange={(e) => setFilters({...filters, dietaryStyle: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-black"
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

              {/* Modern Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button
                  onClick={handleGenerateRecipes}
                  disabled={loading || !mainFood.trim()}
                  className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white px-10 py-5 rounded-2xl text-xl font-bold hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:-translate-y-2 active:translate-y-0 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl">🍳</span>
                        <span>Generate Recipes</span>
                        <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                
                <button
                  onClick={handleSurpriseMe}
                  className="bg-gradient-to-r from-white to-gray-50 text-orange-600 border-2 border-orange-500 px-10 py-5 rounded-2xl text-xl font-bold hover:from-orange-500 hover:to-orange-600 hover:text-white transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 active:translate-y-0 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <span className="text-2xl">🎲</span>
                    <span>Surprise Me</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                {hasSearched && (
                  <button
                    onClick={clearResults}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-5 rounded-2xl text-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 active:translate-y-0 relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <span className="text-2xl">🔄</span>
                      <span>Clear Results</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                )}
              </div>

              {/* Enhanced Error Display */}
              {error && (
                <div className="mt-6 p-6 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 text-red-800 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <p className="font-bold text-lg">Error:</p>
                      <p className="text-base">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {recipes.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                🎉 Your Recipe Collection
              </h2>
              <p className="text-xl text-gray-600">
                {recipes.length} amazing recipes generated by ViralCarrot Smart Composer
              </p>
            </div>
            <button
              onClick={handleRefreshRecipes}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              🔄 Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
