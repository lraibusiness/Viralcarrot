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
  rating?: number;
  difficulty?: string;
  servings?: number;
  matchScore?: number;
  seoDescription?: string;
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export default function RecipeModal({ recipe, onClose }: RecipeModalProps) {
  const [imageError, setImageError] = useState(false);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} hours ${mins} minutes` : `${hours} hours`;
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

  const handleImageError = () => {
    setImageError(true);
  };

  const getFallbackImage = () => {
    const fallbackImages = [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1604503468500-a3c769998f12?w=800&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=400&fit=crop&crop=center'
    ];
    return fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Mobile-Optimized Header */}
        <div className="relative h-48 sm:h-64 flex-shrink-0">
          <Image
            src={imageError ? getFallbackImage() : recipe.image || getFallbackImage()}
            alt={recipe.title}
            fill
            className="object-cover"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Mobile-Optimized Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-slate-800 rounded-full p-2 sm:p-3 transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Mobile-Optimized Recipe Title and Basic Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 leading-tight">
              {recipe.title}
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3 text-sm sm:text-base">
              <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                {formatTime(recipe.cookingTime)}
              </span>
              {recipe.cuisine && (
                <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                  {recipe.cuisine}
                </span>
              )}
              {recipe.mealType && (
                <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                  {recipe.mealType}
                </span>
              )}
              {recipe.difficulty && (
                <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                  {recipe.difficulty}
                </span>
              )}
              {recipe.rating && (
                <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                  {getRatingStars(recipe.rating)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mobile-Optimized Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            {/* Description */}
            {recipe.description && (
              <div className="mb-6">
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                  {recipe.description}
                </p>
              </div>
            )}

            {/* Mobile-Optimized Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Ingredients Section */}
              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center text-sm font-bold">
                    🥘
                  </span>
                  Ingredients
                </h3>
                <div className="bg-slate-50 rounded-xl p-4 sm:p-6">
                  <ul className="space-y-2 sm:space-y-3">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm sm:text-base">
                        <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-slate-700 leading-relaxed">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Instructions Section */}
              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center text-sm font-bold">
                    👨‍🍳
                  </span>
                  Instructions
                </h3>
                <div className="bg-slate-50 rounded-xl p-4 sm:p-6">
                  <ol className="space-y-3 sm:space-y-4">
                    {recipe.steps.map((step, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm sm:text-base">
                        <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-slate-700 leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            {/* Mobile-Optimized Nutrition Info */}
            {recipe.nutrition && (
              <div className="mt-6 sm:mt-8">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">Nutrition Information</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {recipe.nutrition.calories && (
                    <div className="bg-slate-50 rounded-lg p-3 sm:p-4 text-center">
                      <div className="text-lg sm:text-xl font-bold text-slate-900">{recipe.nutrition.calories}</div>
                      <div className="text-xs sm:text-sm text-slate-600">Calories</div>
                    </div>
                  )}
                  {recipe.nutrition.protein && (
                    <div className="bg-slate-50 rounded-lg p-3 sm:p-4 text-center">
                      <div className="text-lg sm:text-xl font-bold text-slate-900">{recipe.nutrition.protein}g</div>
                      <div className="text-xs sm:text-sm text-slate-600">Protein</div>
                    </div>
                  )}
                  {recipe.nutrition.carbs && (
                    <div className="bg-slate-50 rounded-lg p-3 sm:p-4 text-center">
                      <div className="text-lg sm:text-xl font-bold text-slate-900">{recipe.nutrition.carbs}g</div>
                      <div className="text-xs sm:text-sm text-slate-600">Carbs</div>
                    </div>
                  )}
                  {recipe.nutrition.fat && (
                    <div className="bg-slate-50 rounded-lg p-3 sm:p-4 text-center">
                      <div className="text-lg sm:text-xl font-bold text-slate-900">{recipe.nutrition.fat}g</div>
                      <div className="text-xs sm:text-sm text-slate-600">Fat</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile-Optimized Footer */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                <div className="text-sm text-slate-600">
                  <p>Created by <span className="font-medium text-slate-800">{recipe.createdBy || 'ViralCarrot'}</span></p>
                  {recipe.servings && (
                    <p>Serves {recipe.servings} people</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 sm:px-8 py-3 rounded-lg font-medium hover:from-amber-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0"
                >
                  Close Recipe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
