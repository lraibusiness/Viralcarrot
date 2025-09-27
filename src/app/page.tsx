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

  const handleGenerateRecipes = async () => {
    if (!ingredients.trim()) {
      alert('Please enter some ingredients!');
      return;
    }

    setLoading(true);
    try {
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

      if (!response.ok) {
        throw new Error('Failed to generate recipes');
      }

      const data = await response.json();
      setRecipes(data.recipes);
    } catch (error) {
      console.error('Error generating recipes:', error);
      alert('Failed to generate recipes. Please try again.');
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
      'salmon, quinoa, spinach'
    ];
    const randomIngredients = surpriseIngredients[Math.floor(Math.random() * surpriseIngredients.length)];
    setIngredients(randomIngredients);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
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
                className="w-full max-w-2xl mx-auto p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-[#FF914D] focus:outline-none resize-none"
                rows={3}
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
              <select
                value={filters.cookingTime}
                onChange={(e) => setFilters({...filters, cookingTime: e.target.value})}
                className="p-3 border border-gray-200 rounded-lg focus:border-[#FF914D] focus:outline-none"
              >
                <option value="">Cooking Time</option>
                <option value="15">Under 15 min</option>
                <option value="30">15-30 min</option>
                <option value="60">30-60 min</option>
                <option value="120">1-2 hours</option>
                <option value="240">2+ hours</option>
              </select>

              <select
                value={filters.cuisine}
                onChange={(e) => setFilters({...filters, cuisine: e.target.value})}
                className="p-3 border border-gray-200 rounded-lg focus:border-[#FF914D] focus:outline-none"
              >
                <option value="">Cuisine</option>
                <option value="italian">Italian</option>
                <option value="mexican">Mexican</option>
                <option value="asian">Asian</option>
                <option value="indian">Indian</option>
                <option value="mediterranean">Mediterranean</option>
                <option value="american">American</option>
              </select>

              <select
                value={filters.mealType}
                onChange={(e) => setFilters({...filters, mealType: e.target.value})}
                className="p-3 border border-gray-200 rounded-lg focus:border-[#FF914D] focus:outline-none"
              >
                <option value="">Meal Type</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
                <option value="dessert">Dessert</option>
              </select>

              <select
                value={filters.dietaryStyle}
                onChange={(e) => setFilters({...filters, dietaryStyle: e.target.value})}
                className="p-3 border border-gray-200 rounded-lg focus:border-[#FF914D] focus:outline-none"
              >
                <option value="">Dietary Style</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Keto</option>
                <option value="paleo">Paleo</option>
                <option value="gluten-free">Gluten-Free</option>
                <option value="dairy-free">Dairy-Free</option>
              </select>
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
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {recipes.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Your Personalized Recipes
          </h2>
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
