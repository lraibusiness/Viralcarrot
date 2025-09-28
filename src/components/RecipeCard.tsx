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
}

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

export default function RecipeCard({ recipe, onClick }: RecipeCardProps) {
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
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden border border-gray-100 hover:border-orange-200 group transform hover:-translate-y-2"
      onClick={onClick}
    >
      {/* Enhanced Image Section */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={imageError ? getFallbackImage() : recipe.image || getFallbackImage()}
          alt={recipe.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          onError={handleImageError}
        />
        
        {/* Enhanced Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {recipe.createdBy && (
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
              {recipe.createdBy}
            </div>
          )}
          {recipe.matchScore && recipe.matchScore > 8 && (
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
              ⭐ Top Match
            </div>
          )}
        </div>
        
        {/* Time and Rating Overlay */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <div className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
            ⏱️ {formatTime(recipe.cookingTime)}
          </div>
          {recipe.rating && (
            <div className="bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              {getRatingStars(recipe.rating)} {recipe.rating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Enhanced Content Section */}
      <div className="p-6">
        {/* Title and Description */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
          {recipe.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {recipe.description}
        </p>
        
        {/* Enhanced Metadata */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {recipe.cuisine && (
              <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
                <span className="mr-1.5">🌍</span>
                <span className="font-medium">{recipe.cuisine}</span>
              </div>
            )}
            {recipe.mealType && (
              <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
                <span className="mr-1.5">🍽️</span>
                <span className="font-medium">{recipe.mealType}</span>
              </div>
            )}
          </div>
          
          {recipe.difficulty && (
            <div className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </div>
          )}
        </div>
        
        {/* Enhanced Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {recipe.tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 px-3 py-1.5 rounded-full text-xs font-semibold hover:from-orange-200 hover:to-orange-300 transition-all duration-300 cursor-pointer"
              >
                {tag}
              </span>
            ))}
            {recipe.tags.length > 4 && (
              <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                +{recipe.tags.length - 4} more
              </span>
            )}
          </div>
        )}
        
        {/* Modern Action Button */}
        <button className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 text-white py-4 px-6 rounded-xl font-bold text-sm hover:from-orange-600 hover:via-orange-700 hover:to-orange-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 relative overflow-hidden group">
          <span className="relative z-10 flex items-center justify-center gap-2">
            <span className="text-lg">👨‍🍳</span>
            <span>View Recipe</span>
            <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
        
        {/* Additional Info */}
        {recipe.servings && (
          <div className="mt-4 text-center text-sm text-gray-500 font-medium">
            Serves {recipe.servings} people
          </div>
        )}
      </div>
    </div>
  );
}
