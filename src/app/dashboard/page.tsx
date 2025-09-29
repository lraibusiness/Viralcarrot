'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AddRecipeForm from '@/components/AddRecipeForm';
import UserRecipeEditor from '@/components/UserRecipeEditor';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  subscription?: {
    plan: string;
    status: string;
  };
}

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
  website?: string;
  sourceUrl?: string;
  isPublic: boolean;
  status: string;
  createdAt?: string;
  views?: number;
  likes?: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
    fetchUserRecipes();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else if (response.status === 401) {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRecipes = async () => {
    try {
      const response = await fetch('/api/recipes/user');
      if (response.ok) {
        const data = await response.json();
        setUserRecipes(data.recipes || []);
      }
    } catch (error) {
      console.error('Error fetching user recipes:', error);
    }
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    if (!confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/recipes/user/${recipeId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setUserRecipes(userRecipes.filter(recipe => recipe.id !== recipeId));
      } else {
        alert('Failed to delete recipe. Please try again.');
      }
    } catch (error) {
      console.error('Failed to delete recipe:', error);
      alert('Failed to delete recipe. Please try again.');
    }
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
  };

  const handleSaveEdit = async (updatedRecipe: Recipe) => {
    try {
      const response = await fetch(`/api/recipes/user/${updatedRecipe.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRecipe)
      });

      if (response.ok) {
        setUserRecipes(userRecipes.map(recipe => 
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

  const handleRecipeAdded = () => {
    fetchUserRecipes();
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800">ViralCarrot Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-slate-600 hover:text-amber-600 transition-colors">
                Home
              </Link>
              <span className="text-slate-600">Welcome, {user.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Account Info</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {user.name}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Role:</span> <span className="capitalize">{user.role}</span></p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Your Recipes</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Total Recipes:</span> {userRecipes.length}</p>
                <p><span className="font-medium">Public Recipes:</span> {userRecipes.filter(r => r.isPublic).length}</p>
                <p><span className="font-medium">Private Recipes:</span> {userRecipes.filter(r => !r.isPublic).length}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Add New Recipe
                </button>
                <Link
                  href="/"
                  className="block w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-4 rounded-lg transition-colors text-sm text-center"
                >
                  Browse Recipes
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Add Recipe Form */}
        {showAddForm && (
          <div className="mb-8">
            <AddRecipeForm onSuccess={handleRecipeAdded} />
            <div className="text-center mt-4">
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* User Recipes */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Your Recipes</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Add Recipe
              </button>
            </div>
          </div>

          {userRecipes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">No recipes yet</h3>
              <p className="text-slate-600 mb-4">Start sharing your favorite recipes with the community!</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Create Your First Recipe
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userRecipes.map((recipe) => (
                <div key={recipe.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex items-start space-x-3">
                    {recipe.image && (
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 mb-1">{recipe.title}</h3>
                      <p className="text-sm text-slate-600 mb-2 line-clamp-2">{recipe.description}</p>
                      <div className="flex items-center space-x-2 text-xs text-slate-500 mb-3">
                        <span>{recipe.cookingTime} min</span>
                        <span>{recipe.cuisine}</span>
                        <span className={`px-2 py-1 rounded-full ${
                          recipe.isPublic ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {recipe.isPublic ? 'Public' : 'Private'}
                        </span>
                        <span className={`px-2 py-1 rounded-full ${
                          recipe.status === 'approved' ? 'bg-green-100 text-green-800' :
                          recipe.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {recipe.status}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditRecipe(recipe)}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRecipe(recipe.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Recipe Editor Modal */}
      {editingRecipe && (
        <UserRecipeEditor
          recipe={editingRecipe}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
}
