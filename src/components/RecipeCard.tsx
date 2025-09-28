import Image from 'next/image';
import { useState } from 'react';

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
  pantryMatch?: {
    availableIngredients: string[];
    missingIngredients: string[];
    matchPercentage: number;
  };
}

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  showPantryMatch?: boolean;
}

export default function RecipeCard({ recipe, onClick, showPantryMatch = false }: RecipeCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'hard': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getRatingStars = (rating?: number) => {
    if (!rating) return '';
    const stars = '★'.repeat(Math.floor(rating));
    const halfStar = rating % 1 >= 0.5 ? '☆' : '';
    return stars + halfStar;
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (percentage >= 60) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-rose-100 text-rose-800 border-rose-200';
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getFallbackImage = () => {
    const fallbackImages = [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1604503468500-a3c769998f12?w=400&h=300&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&crop=center'
    ];
    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden border border-slate-100 hover:border-amber-200 group transform hover:-translate-y-1"
      onClick={onClick}
    >
      {/* Mobile-Optimized Image Section */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden">
        <Image
          src={imageError ? getFallbackImage() : recipe.image || getFallbackImage()}
          alt={recipe.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          onError={handleImageError}
        />
        
        {/* Mobile-Optimized Badges */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1">
          {recipe.createdBy && (
            <div className="bg-white/90 backdrop-blur-sm text-slate-800 px-2 py-1 rounded-full text-xs font-medium shadow-lg">
              {recipe.createdBy}
            </div>
          )}
          <div className="bg-white/90 backdrop-blur-sm text-slate-800 px-2 py-1 rounded-full text-xs font-medium shadow-lg">
            {formatTime(recipe.cookingTime)}
          </div>
        </div>

        {/* Mobile-Optimized Rating Badge */}
        {recipe.rating && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/90 backdrop-blur-sm text-amber-600 px-2 py-1 rounded-full text-xs font-medium shadow-lg">
            {getRatingStars(recipe.rating)}
          </div>
        )}
      </div>

      {/* Mobile-Optimized Content */}
      <div className="p-4 sm:p-6">
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-medium text-slate-900 mb-2 sm:mb-3 line-clamp-2 group-hover:text-amber-600 transition-colors duration-300">
          {recipe.title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-slate-600 mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
          {recipe.description}
        </p>

        {/* Mobile-Optimized Tags */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
          {recipe.cuisine && (
            <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-medium">
              {recipe.cuisine}
            </span>
          )}
          {recipe.mealType && (
            <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-medium">
              {recipe.mealType}
            </span>
          )}
          {recipe.difficulty && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
          )}
        </div>

        {/* Mobile-Optimized Pantry Match */}
        {showPantryMatch && recipe.pantryMatch && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100">
            <h4 className="text-sm font-medium text-slate-700 mb-2">Pantry Match:</h4>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${getMatchColor(recipe.pantryMatch.matchPercentage)}`}>
              <span>{recipe.pantryMatch.matchPercentage}% Match</span>
            </div>
            
            {/* Available Ingredients */}
            {recipe.pantryMatch.availableIngredients.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-slate-600 mb-1">Available:</p>
                <div className="flex flex-wrap gap-1">
                  {recipe.pantryMatch.availableIngredients.slice(0, 3).map((ingredient, index) => (
                    <span key={index} className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs">
                      {ingredient}
                    </span>
                  ))}
                  {recipe.pantryMatch.availableIngredients.length > 3 && (
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs">
                      +{recipe.pantryMatch.availableIngredients.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Missing Ingredients */}
            {recipe.pantryMatch.missingIngredients.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-slate-600 mb-1">Missing:</p>
                <div className="flex flex-wrap gap-1">
                  {recipe.pantryMatch.missingIngredients.slice(0, 3).map((ingredient, index) => (
                    <span key={index} className="bg-rose-100 text-rose-800 px-2 py-1 rounded-full text-xs">
                      {ingredient}
                    </span>
                  ))}
                  {recipe.pantryMatch.missingIngredients.length > 3 && (
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs">
                      +{recipe.pantryMatch.missingIngredients.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mobile-Optimized Action Button */}
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-100">
          <button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium hover:from-amber-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base">
            View Recipe
          </button>
        </div>
      </div>
    </div>
  );
}
