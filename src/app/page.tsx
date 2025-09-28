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
}

export default function Home() {
  const [mainFood, setMainFood] = useState('');
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
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Popular food suggestions
  const foodSuggestions = [
    'chicken', 'beef', 'pork', 'fish', 'salmon', 'prawns', 'shrimp', 'crab',
    'eggs', 'tofu', 'vegetables', 'pasta', 'rice', 'quinoa', 'bread', 'potatoes',
    'mushrooms', 'lamb', 'duck', 'turkey', 'seafood', 'beans', 'lentils', 'cheese'
  ];

  const handleGenerateRecipes = async () => {
    if (!mainFood.trim()) {
      alert('Please enter a main food item!');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    setError(null);
    
    try {
      const requestData = {
        mainFood: mainFood.trim(),
        ingredients: ingredients.split(',').map(ing => ing.trim()).filter(ing => ing.length > 0),
        filters
      };
      
      console.log('Frontend: Sending request with:', requestData);
      
      const response = await fetch('/api/generateRecipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Frontend: Response status:', response.status);
      console.log('Frontend: Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Frontend: API Error Response:', errorData);
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
      console.error('Frontend: Error message:', error?.message);
      
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
    handleGenerateRecipes();
  };

  const clearResults = () => {
    setRecipes([]);
    setHasSearched(false);
    setError(null);
  };

  const handleMainFoodChange = (value: string) => {
    setMainFood(value);
    setShowSuggestions(value.length > 0);
  };

  const selectSuggestion = (suggestion: string) => {
    setMainFood(suggestion);
    setShowSuggestions(false);
  };

  const filteredSuggestions = foodSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(mainFood.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">
              Create Your Own Recipe with
              <span className="text-[#FF914D]"> Viral Carrot</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Discover amazing recipes based on the ingredients you have. Generate personalized cooking ideas with Viral Carrot.
            </p>

            {/* Main Food Item Input with Autocomplete */}
            <div className="mb-8 relative">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                🍽️ What&apos;s your main food item?
              </label>
              <div className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  value={mainFood}
                  onChange={(e) => handleMainFoodChange(e.target.value)}
                  onFocus={() => setShowSuggestions(mainFood.length > 0)}
                  placeholder="Enter main food item (e.g., chicken, salmon, tofu, vegetables...)"
                  className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-[#FF914D] focus:outline-none text-black"
                />
                
                {/* Suggestions Dropdown */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => selectSuggestion(suggestion)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <span className="font-medium">{suggestion.charAt(0).toUpperCase() + suggestion.slice(1)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {mainFood && (
                <div className="mt-4 p-3 bg-[#FF914D] text-white rounded-lg inline-block">
                  <span className="font-semibold">Selected: {mainFood.charAt(0).toUpperCase() + mainFood.slice(1)}</span>
                </div>
              )}
            </div>

            {/* Supporting Ingredients Input */}
            <div className="mb-8">
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                🥕 What other ingredients do you have?
              </label>
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="Enter supporting ingredients (comma separated)... e.g., garlic, onions, tomatoes, cheese, herbs"
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
                disabled={loading || !mainFood.trim()}
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
            <div>
              <h2 className="text-3xl font-bold text-black">
                Recipes with {mainFood.charAt(0).toUpperCase() + mainFood.slice(1)} ({recipes.length})
              </h2>
              <p className="text-gray-600 mt-2">
                Personalized recipes created just for you
              </p>
            </div>
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
