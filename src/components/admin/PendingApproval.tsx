'use client';

import { useState, useEffect } from 'react';

interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  cookingTime: number;
  cuisine: string;
  mealType: string;
  dietaryStyle: string;
  image: string;
  createdBy: string;
  createdAt: string;
}

export default function PendingApproval() {
  const [pendingRecipes, setPendingRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingRecipes();
  }, []);

  const fetchPendingRecipes = async () => {
    try {
      const response = await fetch('/api/admin/recipes');
      if (response.ok) {
        const data = await response.json();
        const pending = (data.recipes || []).filter((recipe: unknown) => !recipe.isApproved);
        setPendingRecipes(pending);
      }
    } catch (error) {
      console.error('Failed to fetch pending recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (recipeId: string) => {
    try {
      const response = await fetch(`/api/admin/recipes/${recipeId}/approve`, {
        method: 'PUT'
      });

      if (response.ok) {
        setPendingRecipes(pendingRecipes.filter(recipe => recipe.id !== recipeId));
      }
    } catch (error) {
      console.error('Failed to approve recipe:', error);
    }
  };

  const handleReject = async (recipeId: string) => {
    try {
      const response = await fetch(`/api/admin/recipes/${recipeId}/reject`, {
        method: 'PUT'
      });

      if (response.ok) {
        setPendingRecipes(pendingRecipes.filter(recipe => recipe.id !== recipeId));
      }
    } catch (error) {
      console.error('Failed to reject recipe:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Pending Recipe Approvals</h2>
      
      {pendingRecipes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">All caught up!</h3>
          <p className="text-slate-600">No recipes are currently pending approval.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingRecipes.map((recipe) => (
            <div key={recipe.id} className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                {recipe.image && (
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{recipe.title}</h3>
                  <p className="text-slate-600 mb-3">{recipe.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium text-slate-500">Cooking Time</span>
                      <p className="text-slate-800">{recipe.cookingTime} minutes</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-500">Cuisine</span>
                      <p className="text-slate-800 capitalize">{recipe.cuisine}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-500">Meal Type</span>
                      <p className="text-slate-800 capitalize">{recipe.mealType}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-500">Dietary</span>
                      <p className="text-slate-800 capitalize">{recipe.dietaryStyle}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-sm font-medium text-slate-500">Ingredients:</span>
                    <p className="text-slate-800">{recipe.ingredients.join(', ')}</p>
                  </div>

                  <div className="mb-4">
                    <span className="text-sm font-medium text-slate-500">Instructions:</span>
                    <ol className="list-decimal list-inside text-slate-800 mt-1">
                      {recipe.steps.map((step, index) => (
                        <li key={index} className="mb-1">{step}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                      <span>Submitted by: {recipe.createdBy}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleApprove(recipe.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(recipe.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
