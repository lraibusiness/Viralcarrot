import { useState } from 'react';
import Image from 'next/image';

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

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export default function RecipeModal({ recipe, onClose }: RecipeModalProps) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    // In a real app, this would save to user's account
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: `Check out this amazing recipe: ${recipe.title}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${recipe.title} - ${window.location.href}`);
      alert('Recipe link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{recipe.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="p-6">
          {/* Recipe Header */}
          <div className="mb-6">
            <div className="relative h-64 w-full rounded-lg overflow-hidden mb-4">
              <Image
                src={recipe.image}
                alt={recipe.title}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>⏱️ {recipe.cookingTime} min</span>
                {recipe.cuisine && <span>🌍 {recipe.cuisine}</span>}
                {recipe.mealType && <span>🍽️ {recipe.mealType}</span>}
                {recipe.dietaryStyle && <span>🥗 {recipe.dietaryStyle}</span>}
              </div>
              
              {recipe.createdBy && (
                <div className="bg-[#FF914D] text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Created by {recipe.createdBy}
                </div>
              )}
            </div>
            
            <p className="text-gray-700 mb-4">{recipe.description}</p>
            
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {recipe.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Ingredients */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Ingredients</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-[#FF914D] rounded-full mr-3 flex-shrink-0"></span>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Steps */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Instructions</h3>
            <ol className="space-y-4">
              {recipe.steps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-[#FF914D] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-1">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                isSaved
                  ? 'bg-green-500 text-white'
                  : 'bg-[#FF914D] text-white hover:bg-[#e67e3a]'
              }`}
            >
              {isSaved ? '✓ Saved!' : '💾 Save Recipe'}
            </button>
            
            <button
              onClick={handleShare}
              className="flex-1 py-3 px-6 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              📤 Share Recipe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
