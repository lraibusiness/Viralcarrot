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

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

export default function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingStars = (rating?: number) => {
    if (!rating) return '';
    const stars = '★'.repeat(Math.floor(rating));
    const halfStar = rating % 1 >= 0.5 ? '☆' : '';
    return stars + halfStar;
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-[#FF914D] group"
      onClick={onClick}
    >
      {/* Enhanced Image Section */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={recipe.image || '/api/placeholder/400/300'}
          alt={recipe.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center';
          }}
        />
        
        {/* Enhanced Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {recipe.createdBy && (
            <div className="bg-[#FF914D] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              {recipe.createdBy}
            </div>
          )}
          {recipe.matchScore && recipe.matchScore > 8 && (
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              ⭐ Top Match
            </div>
          )}
        </div>
        
        {/* Time and Rating Overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <div className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
            ⏱️ {formatTime(recipe.cookingTime)}
          </div>
          {recipe.rating && (
            <div className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
              {getRatingStars(recipe.rating)} {recipe.rating.toFixed(1)}
            </div>
          )}
        </div>
      </div>
      
      {/* Enhanced Content Section */}
      <div className="p-6">
        {/* Title and Description */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#FF914D] transition-colors">
          {recipe.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {recipe.description}
        </p>
        
        {/* Enhanced Metadata */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {recipe.cuisine && (
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-1">🌍</span>
                <span className="font-medium">{recipe.cuisine}</span>
              </div>
            )}
            {recipe.mealType && (
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-1">🍽️</span>
                <span className="font-medium">{recipe.mealType}</span>
              </div>
            )}
          </div>
          
          {recipe.difficulty && (
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </div>
          )}
        </div>
        
        {/* Enhanced Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.tags.slice(0, 4).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-[#FF914D] hover:text-white transition-colors"
              >
                {tag}
              </span>
            ))}
            {recipe.tags.length > 4 && (
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                +{recipe.tags.length - 4} more
              </span>
            )}
          </div>
        )}
        
        {/* Enhanced Action Button */}
        <button className="w-full bg-gradient-to-r from-[#FF914D] to-[#e67e3a] text-white py-3 px-4 rounded-lg font-semibold hover:from-[#e67e3a] hover:to-[#d35400] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          <span className="flex items-center justify-center gap-2">
            <span>👨‍🍳</span>
            <span>View Recipe</span>
            <span>→</span>
          </span>
        </button>
        
        {/* Additional Info */}
        {recipe.servings && (
          <div className="mt-3 text-center text-sm text-gray-500">
            Serves {recipe.servings} people
          </div>
        )}
      </div>
    </div>
  );
}
