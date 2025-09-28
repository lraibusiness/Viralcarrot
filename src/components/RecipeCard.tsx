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

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect }) => {
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

  const getPantryMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (percentage >= 60) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-amber-200 cursor-pointer group"
      onClick={() => onSelect(recipe)}
    >
      {/* Image */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <Image
          src={imageError ? getFallbackImage() : recipe.image || getFallbackImage()}
          alt={recipe.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={handleImageError}
        />
        
        {/* Recipe Type Badge */}
        <div className="absolute top-3 left-3">
          {recipe.isExternal ? (
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full border border-blue-200">
              Popular Recipe
            </span>
          ) : (
            <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-full border border-amber-200">
              ViralCarrot Original
            </span>
          )}
        </div>

        {/* Ingredient Match Badge */}
        {recipe.ingredientMatch && (
          <div className="absolute top-3 right-3">
            <div className={`px-2 py-1 rounded-full text-xs font-semibold border ${getMatchColor(recipe.ingredientMatch.matchPercentage)}`}>
              {recipe.ingredientMatch.matchPercentage}% Match
            </div>
          </div>
        )}

        {/* Cooking Time */}
        <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full">
          {recipe.cookingTime} min
        </div>

        {/* Rating */}
        {recipe.rating && (
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
            <span>⭐</span>
            <span>{recipe.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        {/* Title */}
        <h3 className="text-lg md:text-xl font-semibold text-slate-800 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
          {recipe.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
          {recipe.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {recipe.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Ingredient Match Info */}
        {recipe.ingredientMatch && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Ingredient Match:</span>
              <span className={`text-sm font-semibold ${getMatchColor(recipe.ingredientMatch.matchPercentage).split(' ')[1]}`}>
                {recipe.ingredientMatch.matchPercentage}%
              </span>
            </div>
            
            {/* Available Ingredients */}
            {recipe.ingredientMatch.availableIngredients.length > 0 && (
              <div className="mb-2">
                <span className="text-xs text-green-600 font-medium">✓ Available: </span>
                <span className="text-xs text-slate-600">
                  {recipe.ingredientMatch.availableIngredients.slice(0, 3).join(', ')}
                  {recipe.ingredientMatch.availableIngredients.length > 3 && '...'}
                </span>
              </div>
            )}

            {/* Missing Ingredients */}
            {recipe.ingredientMatch.missingIngredients.length > 0 && (
              <div>
                <span className="text-xs text-red-600 font-medium">✗ Missing: </span>
                <span className="text-xs text-slate-600">
                  {recipe.ingredientMatch.missingIngredients.slice(0, 2).join(', ')}
                  {recipe.ingredientMatch.missingIngredients.length > 2 && '...'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Recipe Info */}
        <div className="flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center gap-3">
            <span>{recipe.cuisine}</span>
            <span>•</span>
            <span>{recipe.mealType}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-amber-500">👨‍🍳</span>
            <span className="text-xs">{recipe.createdBy}</span>
          </div>
        </div>

        {/* External Recipe Link */}
        {recipe.isExternal && recipe.sourceUrl && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <a
              href={recipe.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <span>View on {recipe.createdBy}</span>
              <span>↗</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
