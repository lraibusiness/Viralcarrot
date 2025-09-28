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
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps'>('ingredients');
  const [imageError, setImageError] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<number[]>([]);

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

  const toggleStepExpansion = (stepIndex: number) => {
    setExpandedSteps(prev => 
      prev.includes(stepIndex) 
        ? prev.filter(index => index !== stepIndex)
        : [...prev, stepIndex]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
        {/* Header - Fixed */}
        <div className="relative h-64 md:h-80 flex-shrink-0">
          <Image
            src={imageError ? getFallbackImage() : recipe.image || getFallbackImage()}
            alt={recipe.title}
            fill
            className="object-cover"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Modern Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 rounded-full p-3 transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Recipe Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">{recipe.title}</h2>
            <p className="text-lg opacity-90 mb-4 leading-relaxed">{recipe.description}</p>
            
            {/* Enhanced Recipe Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <span>⏱️</span>
                <span className="font-semibold">{formatTime(recipe.cookingTime)}</span>
              </div>
              
              {recipe.rating && (
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span>{getRatingStars(recipe.rating)}</span>
                  <span className="font-semibold">{recipe.rating.toFixed(1)}</span>
                </div>
              )}
              
              {recipe.cuisine && (
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span>🌍</span>
                  <span className="font-semibold">{recipe.cuisine}</span>
                </div>
              )}
              
              {recipe.mealType && (
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span>🍽️</span>
                  <span className="font-semibold">{recipe.mealType}</span>
                </div>
              )}
              
              {recipe.servings && (
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span>👥</span>
                  <span className="font-semibold">Serves {recipe.servings}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Content - Scrollable */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-6 flex-shrink-0">
            {/* Enhanced Difficulty Badge */}
            {recipe.difficulty && (
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold border-2 mb-6 ${getDifficultyColor(recipe.difficulty)}`}>
                Difficulty: {recipe.difficulty}
              </div>
            )}
            
            {/* Enhanced Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Modern Tab Navigation */}
            <div className="flex border-b-2 border-gray-100 mb-6">
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`px-6 py-3 font-bold text-base border-b-4 transition-all duration-300 ${
                  activeTab === 'ingredients'
                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                🥘 Ingredients ({recipe.ingredients.length})
              </button>
              <button
                onClick={() => setActiveTab('steps')}
                className={`px-6 py-3 font-bold text-base border-b-4 transition-all duration-300 ${
                  activeTab === 'steps'
                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                👨‍🍳 Instructions ({recipe.steps.length})
              </button>
            </div>
          </div>
          
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {activeTab === 'ingredients' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Ingredients</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <span className="text-orange-500 font-bold text-lg">•</span>
                      <span className="text-gray-700 leading-relaxed text-base">{ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'steps' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Cooking Instructions</h3>
                  <button
                    onClick={() => setExpandedSteps(expandedSteps.length === recipe.steps.length ? [] : recipe.steps.map((_, i) => i))}
                    className="text-orange-600 hover:text-orange-700 font-semibold text-sm"
                  >
                    {expandedSteps.length === recipe.steps.length ? 'Collapse All' : 'Expand All'}
                  </button>
                </div>
                
                <div className="space-y-4">
                  {recipe.steps.map((step, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                      <button
                        onClick={() => toggleStepExpansion(index)}
                        className="w-full p-4 text-left bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all duration-300 flex items-center gap-4"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium leading-relaxed">
                            {expandedSteps.includes(index) ? step : step.length > 100 ? `${step.substring(0, 100)}...` : step}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <svg 
                            className={`w-5 h-5 text-orange-600 transition-transform duration-300 ${expandedSteps.includes(index) ? 'rotate-180' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                      
                      {expandedSteps.includes(index) && (
                        <div className="p-4 bg-white border-t border-gray-100">
                          <p className="text-gray-700 leading-relaxed text-base">{step}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Fixed Footer Actions */}
          <div className="p-6 border-t-2 border-gray-100 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-xl font-bold text-base hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 relative overflow-hidden group">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span className="text-xl">💾</span>
                  <span>Save Recipe</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button className="bg-gradient-to-r from-slate-500 to-slate-600 text-white py-4 px-6 rounded-xl font-bold text-base hover:from-slate-600 hover:to-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 relative overflow-hidden group">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span className="text-xl">📤</span>
                  <span>Share Recipe</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold text-base hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 relative overflow-hidden group">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span className="text-xl">🛒</span>
                  <span>Shopping List</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
