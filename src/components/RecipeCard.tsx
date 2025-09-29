import React, { memo } from 'react';
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
  views?: number;
  likes?: number;
  createdAt?: string;
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
  onClick: () => void;
}

const RecipeCard = memo(({ recipe, onClick }: RecipeCardProps) => {
  const safeTags = recipe.tags || [];
  const safeAvailableIngredients = recipe.ingredientMatch?.availableIngredients || [];
  const safeMissingIngredients = recipe.ingredientMatch?.missingIngredients || [];
  const matchPercentage = recipe.ingredientMatch?.matchPercentage || 0;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 overflow-hidden border border-slate-100"
    >
      <div className="relative h-48 w-full">
        <Image
          src={recipe.image || '/placeholder-recipe.jpg'}
          alt={recipe.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {recipe.isExternal && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            External
          </div>
        )}
        {matchPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {matchPercentage}% match
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">
          {recipe.title}
        </h3>
        
        <p className="text-slate-600 text-sm mb-3 line-clamp-2">
          {recipe.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-slate-500 mb-3">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {recipe.cookingTime} min
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            {recipe.cuisine || 'Any'}
          </span>
        </div>
        
        {safeTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {safeTags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-amber-50 text-amber-700 px-2 py-1 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
            {safeTags.length > 3 && (
              <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs font-medium">
                +{safeTags.length - 3}
              </span>
            )}
          </div>
        )}
        
        {matchPercentage > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-slate-600">Ingredient Match</span>
              <span className="font-semibold text-green-600">{matchPercentage}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${matchPercentage}%` }}
              ></div>
            </div>
            {safeAvailableIngredients.length > 0 && (
              <p className="text-xs text-green-600 mt-1">
                Available: {safeAvailableIngredients.slice(0, 3).join(', ')}
                {safeAvailableIngredients.length > 3 && ` +${safeAvailableIngredients.length - 3} more`}
              </p>
            )}
            {safeMissingIngredients.length > 0 && (
              <p className="text-xs text-red-600 mt-1">
                Missing: {safeMissingIngredients.slice(0, 3).join(', ')}
                {safeMissingIngredients.length > 3 && ` +${safeMissingIngredients.length - 3} more`}
              </p>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">
            by {recipe.createdBy}
          </span>
          {recipe.views && (
            <span className="text-xs text-slate-500 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              {recipe.views}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

RecipeCard.displayName = 'RecipeCard';

export default RecipeCard;
