import Image from 'next/image';

interface Recipe {
  id: string;
  title: string;
  image: string;
  description: string;
  ingredients: string[];
  steps: string[];
  cookingTime: number;
}

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

export default function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer overflow-hidden">
      <div className="relative h-48">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-sm font-medium text-gray-700">
            {recipe.cookingTime} min
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {recipe.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {recipe.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-2">🍽️</span>
            <span>{recipe.ingredients.length} ingredients</span>
          </div>
          
          <button
            onClick={onClick}
            className="bg-[#FF914D] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#e67e3a] transition-colors"
          >
            View Recipe
          </button>
        </div>
      </div>
    </div>
  );
}
