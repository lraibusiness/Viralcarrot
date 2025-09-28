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
            <h2 className="text-3xl font-light mb-2 leading-tight">{recipe.title}</h2>
            <p className="text-base opacity-90 mb-4 leading-relaxed font-light line-clamp-2">{recipe.description}</p>
            
            {/* Quick Info */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <span className="font-medium">{formatTime(recipe.cookingTime)}</span>
              </div>
              
              {recipe.rating && (
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span>{getRatingStars(recipe.rating)}</span>
                  <span className="font-medium">{recipe.rating.toFixed(1)}</span>
                </div>
              )}
              
              {recipe.cuisine && (
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span className="font-medium">{recipe.cuisine}</span>
                </div>
              )}
              
              {recipe.servings && (
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span className="font-medium">Serves {recipe.servings}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Content - Side by Side Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Side - Recipe Details */}
          <div className="w-1/3 bg-slate-50 border-r border-slate-200 overflow-y-auto">
            <div className="p-6">
              {/* Difficulty Badge */}
              {recipe.difficulty && (
                <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium border mb-6 ${getDifficultyColor(recipe.difficulty)}`}>
                  Difficulty: {recipe.difficulty}
                </div>
              )}
              
              {/* Tags */}
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Ingredients */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-slate-900 mb-4">Ingredients</h3>
                <div className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-amber-300 transition-colors">
                      <span className="text-amber-500 font-medium text-sm mt-0.5">•</span>
                      <span className="text-slate-700 text-sm leading-relaxed">{ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Nutrition Info */}
              {recipe.nutrition && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Nutrition (per serving)</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                      <div className="text-lg font-semibold text-slate-900">{recipe.nutrition.calories}</div>
                      <div className="text-xs text-slate-600">Calories</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                      <div className="text-lg font-semibold text-slate-900">{recipe.nutrition.protein}g</div>
                      <div className="text-xs text-slate-600">Protein</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Side - Cooking Instructions */}
          <div className="w-2/3 overflow-y-auto">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-medium text-slate-900 mb-2">Cooking Instructions</h3>
                <p className="text-sm text-slate-600">Follow these steps to create your delicious meal</p>
              </div>
              
              <div className="space-y-4">
                {recipe.steps.map((step, index) => (
                  <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-700 leading-relaxed text-base">{step}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-200 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-4 px-6 rounded-xl font-medium hover:from-amber-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 relative overflow-hidden group">
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>Save Recipe</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button className="bg-gradient-to-r from-slate-500 to-slate-600 text-white py-4 px-6 rounded-xl font-medium hover:from-slate-600 hover:to-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 relative overflow-hidden group">
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>Share Recipe</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 relative overflow-hidden group">
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>Shopping List</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
