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
      {/* Compact Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={imageError ? getFallbackImage() : recipe.image || getFallbackImage()}
          alt={recipe.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          onError={handleImageError}
        />
        
        {/* Minimalist Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {recipe.createdBy && (
            <div className="bg-white/90 backdrop-blur-sm text-slate-800 px-2 py-1 rounded-full text-xs font-medium shadow-lg">
              {recipe.createdBy}
            </div>
          )}
          {recipe.matchScore && recipe.matchScore > 8 && (
            <div className="bg-amber-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
              Top Match
            </div>
          )}
        </div>
        
        {/* Time and Rating Overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
            {formatTime(recipe.cookingTime)}
          </div>
          {recipe.rating && (
            <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
              {getRatingStars(recipe.rating)} {recipe.rating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Pantry Match Badge */}
        {showPantryMatch && recipe.pantryMatch && (
          <div className="absolute bottom-3 left-3">
            <div className={`px-3 py-1 rounded-full text-xs font-medium border shadow-lg ${getMatchColor(recipe.pantryMatch.matchPercentage)}`}>
              {recipe.pantryMatch.matchPercentage}% Match
            </div>
          </div>
        )}

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Compact Content Section */}
      <div className="p-5">
        {/* Title and Description */}
        <h3 className="text-lg font-light text-slate-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors duration-300">
          {recipe.title}
        </h3>
        
        <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed font-light">
          {recipe.description}
        </p>
        
        {/* Pantry Match Info */}
        {showPantryMatch && recipe.pantryMatch && (
          <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-700">Pantry Match</span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getMatchColor(recipe.pantryMatch.matchPercentage)}`}>
                {recipe.pantryMatch.matchPercentage}%
              </span>
            </div>
            <div className="text-xs text-slate-600">
              <div className="mb-1">
                <span className="font-medium text-emerald-700">✓ You have:</span> {recipe.pantryMatch.availableIngredients.slice(0, 3).join(', ')}
                {recipe.pantryMatch.availableIngredients.length > 3 && ` +${recipe.pantryMatch.availableIngredients.length - 3} more`}
              </div>
              {recipe.pantryMatch.missingIngredients.length > 0 && (
                <div>
                  <span className="font-medium text-rose-700">✗ Need:</span> {recipe.pantryMatch.missingIngredients.slice(0, 2).join(', ')}
                  {recipe.pantryMatch.missingIngredients.length > 2 && ` +${recipe.pantryMatch.missingIngredients.length - 2} more`}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Compact Metadata */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {recipe.cuisine && (
              <div className="flex items-center text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded-full font-medium">
                {recipe.cuisine}
              </div>
            )}
            {recipe.mealType && (
              <div className="flex items-center text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded-full font-medium">
                {recipe.mealType}
              </div>
            )}
          </div>
          
          {recipe.difficulty && (
            <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </div>
          )}
        </div>
        
        {/* Compact Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {recipe.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="bg-amber-50 text-amber-700 px-2 py-1 rounded-full text-xs font-medium hover:bg-amber-100 transition-colors duration-300"
              >
                {tag}
              </span>
            ))}
            {recipe.tags.length > 2 && (
              <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs font-medium">
                +{recipe.tags.length - 2}
              </span>
            )}
          </div>
        )}
        
        {/* Compact Action Button */}
        <button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:from-amber-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 relative overflow-hidden group">
          <span className="relative z-10 flex items-center justify-center gap-2 text-sm">
            <span>View Recipe</span>
            <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
        
        {/* Servings Info */}
        {recipe.servings && (
          <div className="mt-2 text-center text-xs text-slate-500 font-light">
            Serves {recipe.servings} people
          </div>
        )}
      </div>
    </div>
  );
}
