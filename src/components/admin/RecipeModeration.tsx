'use client';

import { useState, useEffect } from 'react';
import RecipeEditor from './RecipeEditor';

interface Recipe {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  isApproved: boolean;
  createdAt: string;
  image?: string;
  ingredients?: string[];
  steps?: string[];
  cookingTime?: number;
  cuisine?: string;
  mealType?: string;
  dietaryStyle?: string;
  status?: string;
}

export default function RecipeModeration() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/admin/recipes');
      if (response.ok) {
        const data = await response.json();
        setRecipes(data.recipes || []);
      }
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
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
        setRecipes(recipes.map(recipe => 
          recipe.id === recipeId ? { ...recipe, isApproved: true, status: 'approved' } : recipe
        ));
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
        setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
      }
    } catch (error) {
      console.error('Failed to reject recipe:', error);
    }
  };

  const handleDelete = async (recipeId: string) => {
    if (!confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/recipes?id=${recipeId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to delete recipe. Please try again.');
      }
    } catch (error) {
      console.error('Failed to delete recipe:', error);
      alert('Failed to delete recipe. Please try again.');
    }
  };

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
  };

  const handleSaveEdit = async (updatedRecipe: Recipe) => {
    try {
      const response = await fetch('/api/admin/recipes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRecipe)
      });

      if (response.ok) {
        setRecipes(recipes.map(recipe => 
          recipe.id === updatedRecipe.id ? updatedRecipe : recipe
        ));
        setEditingRecipe(null);
      } else {
        alert('Failed to update recipe. Please try again.');
      }
    } catch (error) {
      console.error('Failed to update recipe:', error);
      alert('Failed to update recipe. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingRecipe(null);
  };

  const filteredRecipes = recipes.filter(recipe => {
    if (filter === 'approved') return recipe.isApproved;
    if (filter === 'pending') return !recipe.isApproved;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Recipe Management</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'all' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            All ({recipes.length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'approved' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Approved ({recipes.filter(r => r.isApproved).length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'pending' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Pending ({recipes.filter(r => !r.isApproved).length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex items-start space-x-4">
              {recipe.image && (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">{recipe.title}</h3>
                    <p className="text-sm text-slate-600 mb-2 line-clamp-2">{recipe.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <span>By: {recipe.createdBy}</span>
                      <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
                      <span className={`px-2 py-1 rounded-full ${
                        recipe.isApproved 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {recipe.isApproved ? 'Approved' : 'Pending'}
                      </span>
                      {recipe.cookingTime && <span>{recipe.cookingTime} min</span>}
                      {recipe.cuisine && <span>{recipe.cuisine}</span>}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(recipe)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    {!recipe.isApproved && (
                      <button
                        onClick={() => handleApprove(recipe.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                      >
                        Approve
                      </button>
                    )}
                    {!recipe.isApproved && (
                      <button
                        onClick={() => handleReject(recipe.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Reject
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(recipe.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No recipes found</h3>
          <p className="text-slate-600">
            {filter === 'all' ? 'No recipes have been submitted yet.' : 
             filter === 'approved' ? 'No approved recipes found.' : 
             'No pending recipes found.'}
          </p>
        </div>
      )}

      {/* Recipe Editor Modal */}
      {editingRecipe && (
        <RecipeEditor
          recipe={editingRecipe as any}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
}
