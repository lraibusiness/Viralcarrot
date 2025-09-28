'use client';

import React from 'react';
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

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export default function RecipeModal({ recipe, onClose }: RecipeModalProps) {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">{recipe.title}</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Image and Info */}
            <div className="space-y-6">
              <div className="relative">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover rounded-xl"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Description</h3>
                  <p className="text-slate-600">{recipe.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-sm text-slate-500">Cooking Time</p>
                    <p className="font-semibold text-slate-800">{recipe.cookingTime} minutes</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-sm text-slate-500">Difficulty</p>
                    <p className="font-semibold text-slate-800">{recipe.difficulty || 'Medium'}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-sm text-slate-500">Servings</p>
                    <p className="font-semibold text-slate-800">{recipe.servings || 4}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-sm text-slate-500">Rating</p>
                    <p className="font-semibold text-slate-800">{recipe.rating?.toFixed(1) || '4.5'}/5</p>
                  </div>
                </div>

                {recipe.nutrition && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Nutrition (per serving)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-amber-50 rounded-lg p-3">
                        <p className="text-sm text-amber-600">Calories</p>
                        <p className="font-semibold text-amber-800">{recipe.nutrition.calories}</p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3">
                        <p className="text-sm text-amber-600">Protein</p>
                        <p className="font-semibold text-amber-800">{recipe.nutrition.protein}g</p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3">
                        <p className="text-sm text-amber-600">Carbs</p>
                        <p className="font-semibold text-amber-800">{recipe.nutrition.carbs}g</p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3">
                        <p className="text-sm text-amber-600">Fat</p>
                        <p className="font-semibold text-amber-800">{recipe.nutrition.fat}g</p>
                      </div>
                    </div>
                  </div>
                )}

                {recipe.ingredientMatch && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Ingredient Match</h3>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-green-600">Match Percentage</span>
                        <span className="text-lg font-bold text-green-800">
                          {recipe.ingredientMatch.matchPercentage}%
                        </span>
                      </div>
                      {recipe.ingredientMatch.availableIngredients.length > 0 && (
                        <div className="mb-2">
                          <p className="text-sm text-green-600 mb-1">Available Ingredients:</p>
                          <div className="flex flex-wrap gap-1">
                            {recipe.ingredientMatch.availableIngredients.map((ingredient, index) => (
                              <span key={index} className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs">
                                {ingredient}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {recipe.ingredientMatch.missingIngredients.length > 0 && (
                        <div>
                          <p className="text-sm text-red-600 mb-1">Missing Ingredients:</p>
                          <div className="flex flex-wrap gap-1">
                            {recipe.ingredientMatch.missingIngredients.map((ingredient, index) => (
                              <span key={index} className="bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs">
                                {ingredient}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Ingredients and Steps */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Ingredients</h3>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span className="text-slate-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Instructions</h3>
                <ol className="space-y-3">
                  {recipe.steps.map((step, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-slate-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {recipe.tags && recipe.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag, index) => (
                      <span key={index} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {recipe.isExternal && recipe.sourceUrl && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 mb-2">External Recipe</p>
                  <a 
                    href={recipe.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    View Original Recipe
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
