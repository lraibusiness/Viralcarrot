import React, { useState } from 'react';
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

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getFallbackImage = () => {
    return 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop';
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (percentage >= 60) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Header with Image and Basic Info */}
        <div className="relative h-64 flex-shrink-0">
          <Image
            src={imageError ? getFallbackImage() : recipe.image || getFallbackImage()}
            alt={recipe.title}
            fill
            className="object-cover"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-800 rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Recipe Title and Basic Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{recipe.title}</h2>
            <p className="text-lg opacity-90 mb-4">{recipe.description}</p>
            
            {/* Recipe Type Badge */}
            <div className="mb-4">
              {recipe.isExternal ? (
                <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full border border-blue-200">
                  Popular Recipe from {recipe.createdBy}
                </span>
              ) : (
                <span className="bg-amber-100 text-amber-800 text-sm font-semibold px-3 py-1 rounded-full border border-amber-200">
                  ViralCarrot Original
                </span>
              )}
            </div>

            {/* Recipe Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span>⏱️</span>
                <span>{recipe.cookingTime} min</span>
              </div>
              <div className="flex items-center gap-1">
                <span>👥</span>
                <span>{recipe.servings || 4} servings</span>
              </div>
              {recipe.rating && (
                <div className="flex items-center gap-1">
                  <span>⭐</span>
                  <span>{recipe.rating.toFixed(1)}</span>
                </div>
              )}
              {recipe.difficulty && (
                <div className="flex items-center gap-1">
                  <span>📊</span>
                  <span>{recipe.difficulty}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area - Ingredients & Instructions */}
        <div className="flex-grow overflow-y-auto p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Ingredients Section */}
          <div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">Ingredients</h3>
            <ul className="list-disc list-inside text-slate-700 space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>

            {/* Ingredient Match Info */}
            {recipe.ingredientMatch && (
              <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                <h4 className="text-lg font-semibold text-slate-800 mb-3">Ingredient Match</h4>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-700">Match Percentage:</span>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${getMatchColor(recipe.ingredientMatch.matchPercentage)}`}>
                    {recipe.ingredientMatch.matchPercentage}%
                  </span>
                </div>
                
                {/* Available Ingredients */}
                {recipe.ingredientMatch.availableIngredients.length > 0 && (
                  <div className="mb-3">
                    <span className="text-sm text-green-600 font-medium">✓ Available Ingredients:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {recipe.ingredientMatch.availableIngredients.map((ingredient, index) => (
                        <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Ingredients */}
                {recipe.ingredientMatch.missingIngredients.length > 0 && (
                  <div>
                    <span className="text-sm text-red-600 font-medium">✗ Missing Ingredients:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {recipe.ingredientMatch.missingIngredients.map((ingredient, index) => (
                        <span key={index} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Nutrition Info */}
            {recipe.nutrition && (
              <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                <h4 className="text-lg font-semibold text-slate-800 mb-3">Nutrition (per serving)</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>Calories:</span>
                    <span className="font-medium">{recipe.nutrition.calories}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Protein:</span>
                    <span className="font-medium">{recipe.nutrition.protein}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carbs:</span>
                    <span className="font-medium">{recipe.nutrition.carbs}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fat:</span>
                    <span className="font-medium">{recipe.nutrition.fat}g</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Instructions Section */}
          <div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">Instructions</h3>
            <ol className="list-decimal list-inside text-slate-700 space-y-3">
              {recipe.steps.map((step, index) => (
                <li key={index} className="leading-relaxed">{step}</li>
              ))}
            </ol>

            {/* Tags */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-slate-800 mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-sm bg-slate-100 text-slate-600 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* External Recipe Link */}
            {recipe.isExternal && recipe.sourceUrl && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <h4 className="text-lg font-semibold text-slate-800 mb-2">View Original Recipe</h4>
                <p className="text-sm text-slate-600 mb-3">
                  This recipe is from {recipe.createdBy}. Click below to view the original recipe with more details.
                </p>
                <a
                  href={recipe.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>View on {recipe.createdBy}</span>
                  <span>↗</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
