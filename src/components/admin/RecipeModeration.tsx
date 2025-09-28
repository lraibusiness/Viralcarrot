'use client';

import { useState, useEffect } from 'react';

interface Recipe {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  isApproved: boolean;
  createdAt: string;
}

export default function RecipeModeration() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');

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
          recipe.id === recipeId ? { ...recipe, isApproved: true } : recipe
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
        <h2 className="text-2xl font-bold text-slate-800">Recipe Moderation</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'all' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'approved' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded text-sm ${
              filter === 'pending' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Pending
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 mb-1">{recipe.title}</h3>
                <p className="text-sm text-slate-600 mb-2">{recipe.description}</p>
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
                </div>
              </div>
              {!recipe.isApproved && (
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleApprove(recipe.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(recipe.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
