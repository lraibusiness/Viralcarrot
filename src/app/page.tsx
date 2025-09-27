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
}

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [filters, setFilters] = useState({
    cookingTime: '',
    cuisine: '',
    mealType: '',
    dietaryStyle: ''
  });
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateRecipes = async () => {
    if (!ingredients.trim()) {
      alert('Please enter some ingredients!');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    setError(null);
    
    try {
      console.log('Sending request with:', { ingredients, filters });
      
      const response = await fetch('/api/generateRecipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients: ingredients.split(',').map(ing => ing.trim()),
          filters
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);

      if (data.success && data.recipes) {
        setRecipes(data.recipes);
        setError(null);
      } else {
        throw new Error(data.error || 'Invalid response format');
      }
    } catch (error) {
      console.error('Error generating recipes:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate recipes. Please try again.';
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSurpriseMe = () => {
    const surpriseIngredients = [
      'chicken, rice, vegetables',
      'pasta, tomatoes, cheese',
      'eggs, bread, milk',
      'beef, potatoes, onions',
      'salmon, quinoa, spinach',
      'prawns, garlic, butter'
    ];
    const randomIngredients = surpriseIngredients[Math.floor(Math.random() * surpriseIngredients.length)];
    setIngredients(randomIngredients);
  };

  const handleRefreshRecipes = () => {
    handleGenerateRecipes();
  };

  const clearResults = () => {
    setRecipes([]);
    setHasSearched(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">
              Turn Your Ingredients Into
              <span className="text-[#FF914D]"> Amazing Recipes</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Simply enter the ingredients you have, and we'll generate personalized recipes just for you.
            </p>

            {/* Ingredients Input */}
            <div className="mb-8">
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="Enter your ingredients (comma separated)... e.g., chicken, rice, vegetables, garlic"
                className="w-full max-w-2xl mx-auto p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-[#FF914D] focus:outline-none resize-none text-black"
                rows={3}
              />
            </div>

            {/* Enhanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-[#FF914D] transition-colors">
                <label className="block text-sm font-semibold text-gray-700 mb-2">⏱️ Cooking Time</label>
                <select
                  value={filters.cookingTime}
                  onChange={(e) => setFilters({...filters, cookingTime: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-[#FF914D] focus:outline-none text-black"
                >
                  <option value="">Any Time</option>
                  <option value="15">Under 15 min</option>
                  <option value="30">15-30 min</option>
                  <option value="60">30-60 min</option>
                  <option value="120">1-2 hours</option>
                  <option value="240">2+ hours</option>
                </select>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-[#FF914D] transition-colors">
                <label className="block text-sm font-semibold text-gray-700 mb-2">🌍 Cuisine</label>
                <select
                  value={filters.cuisine}
                  onChange={(e) => setFilters({...filters, cuisine: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-[#FF914D] focus:outline-none text-black"
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

              <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-[#FF914D] transition-colors">
                <label className="block text-sm font-semibold text-gray-700 mb-2">🍽️ Meal Type</label>
                <select
                  value={filters.mealType}
                  onChange={(e) => setFilters({...filters, mealType: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-[#FF914D] focus:outline-none text-black"
                >
                  <option value="">Any Meal</option>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                  <option value="dessert">Dessert</option>
                </select>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-[#FF914D] transition-colors">
                <label className="block text-sm font-semibold text-gray-700 mb-2">🥗 Dietary Style</label>
                <select
                  value={filters.dietaryStyle}
                  onChange={(e) => setFilters({...filters, dietaryStyle: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-[#FF914D] focus:outline-none text-black"
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleGenerateRecipes}
                disabled={loading}
                className="bg-[#FF914D] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#e67e3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? 'Generating...' : 'Generate Recipes'}
              </button>
              
              <button
                onClick={handleSurpriseMe}
                className="bg-white text-[#FF914D] border-2 border-[#FF914D] px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#FF914D] hover:text-white transition-colors"
              >
                🎲 Surprise Me
              </button>

              {hasSearched && (
                <button
                  onClick={clearResults}
                  className="bg-gray-500 text-white px-6 py-4 rounded-xl text-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  🔄 Clear Results
                </button>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <p className="font-semibold">Error:</p>
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {recipes.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-black">
              Your Personalized Recipes ({recipes.length})
            </h2>
            <button
              onClick={handleRefreshRecipes}
              className="bg-[#FF914D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#e67e3a] transition-colors"
            >
              🔄 Get More Recipes
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
}
