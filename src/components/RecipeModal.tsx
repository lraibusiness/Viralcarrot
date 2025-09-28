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

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export default function RecipeModal({ recipe, onClose }: RecipeModalProps) {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps'>('ingredients');

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} hours ${mins} minutes` : `${hours} hours`;
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRatingStars = (rating?: number) => {
    if (!rating) return '';
    const stars = '★'.repeat(Math.floor(rating));
    const halfStar = rating % 1 >= 0.5 ? '☆' : '';
    return stars + halfStar;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="relative h-64 md:h-80">
          <img
            src={recipe.image || '/api/placeholder/800/400'}
            alt={recipe.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=400&fit=crop&crop=center';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 rounded-full p-2 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Recipe Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{recipe.title}</h2>
            <p className="text-lg opacity-90 mb-4">{recipe.description}</p>
            
            {/* Recipe Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span>⏱️</span>
                <span className="font-semibold">{formatTime(recipe.cookingTime)}</span>
              </div>
              
              {recipe.rating && (
                <div className="flex items-center gap-1">
                  <span>{getRatingStars(recipe.rating)}</span>
                  <span className="font-semibold">{recipe.rating.toFixed(1)}</span>
                </div>
              )}
              
              {recipe.cuisine && (
                <div className="flex items-center gap-1">
                  <span>��</span>
                  <span className="font-semibold">{recipe.cuisine}</span>
                </div>
              )}
              
              {recipe.mealType && (
                <div className="flex items-center gap-1">
                  <span>🍽️</span>
                  <span className="font-semibold">{recipe.mealType}</span>
                </div>
              )}
              
              {recipe.servings && (
                <div className="flex items-center gap-1">
                  <span>👥</span>
                  <span className="font-semibold">Serves {recipe.servings}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Difficulty Badge */}
          {recipe.difficulty && (
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border-2 mb-6 ${getDifficultyColor(recipe.difficulty)}`}>
              Difficulty: {recipe.difficulty}
            </div>
          )}
          
          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-[#FF914D] text-white px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
                activeTab === 'ingredients'
                  ? 'border-[#FF914D] text-[#FF914D]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              🥘 Ingredients ({recipe.ingredients.length})
            </button>
            <button
              onClick={() => setActiveTab('steps')}
              className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
                activeTab === 'steps'
                  ? 'border-[#FF914D] text-[#FF914D]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              👨‍🍳 Steps ({recipe.steps.length})
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="max-h-96 overflow-y-auto">
            {activeTab === 'ingredients' && (
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Ingredients</h3>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-[#FF914D] font-bold text-lg">•</span>
                      <span className="text-gray-700 leading-relaxed">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {activeTab === 'steps' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Cooking Instructions</h3>
                <ol className="space-y-4">
                  {recipe.steps.map((step, index) => (
                    <li key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#FF914D] text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700 leading-relaxed">{step}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
          
          {/* Footer Actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
            <button className="flex-1 bg-[#FF914D] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#e67e3a] transition-colors">
              💾 Save Recipe
            </button>
            <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
              📤 Share Recipe
            </button>
            <button className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors">
              🛒 Add to Shopping List
            </button>
          </div>
          
          {/* SEO Description (hidden but for SEO) */}
          {recipe.seoDescription && (
            <div className="hidden">
              <meta name="description" content={recipe.seoDescription} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
