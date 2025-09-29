'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AddRecipeForm from '@/components/AddRecipeForm';
import UserRecipeEditor from '@/components/UserRecipeEditor';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  totalRecipesGenerated?: number;
  subscription?: {
    plan: string;
    status: string;
    expiresAt?: string;
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
  createdBy: string;
  status: string;
  isApproved: boolean;
  createdAt: string;
  isPublic: boolean;
  views?: number;
  likes?: number;
  tags?: string[];
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchUserRecipes = useCallback(async () => {
    try {
      const response = await fetch('/api/recipes/user');
      if (response.ok) {
        const data = await response.json();
        setUserRecipes(data.recipes || []);
      }
    } catch (error) {
      console.error('Error fetching user recipes:', error);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchUserRecipes();
  }, [fetchUserData, fetchUserRecipes]);

  const handleLogout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [router]);

  const handleDeleteRecipe = useCallback(async (recipeId: string) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    try {
      const response = await fetch(`/api/recipes/user/${recipeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUserRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      } else {
        setError('Failed to delete recipe');
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      setError('Failed to delete recipe');
    }
  }, []);

  const handleEditRecipe = useCallback((recipe: Recipe) => {
    setEditingRecipe(recipe);
  }, []);

  const handleSaveRecipe = useCallback((updatedRecipe: Recipe) => {
    setEditingRecipe(null);
    fetchUserRecipes();
  }, [fetchUserRecipes]);

  const handleAddRecipe = useCallback(() => {
    setShowAddForm(false);
    fetchUserRecipes();
  }, [fetchUserRecipes]);

  // Memoized user stats
  const userStats = useMemo(() => {
    if (!user) return null;
    
    const totalRecipes = userRecipes.length;
    const approvedRecipes = userRecipes.filter(r => r.isApproved || r.status === 'approved').length;
    const pendingRecipes = userRecipes.filter(r => !r.isApproved && r.status !== 'approved').length;
    
    return {
      totalRecipes,
      approvedRecipes,
      pendingRecipes,
      totalGenerated: user.totalRecipesGenerated || 0
    };
  }, [user, userRecipes]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800">ViralCarrot Dashboard</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-colors">
                Home
              </Link>
              {user.role === 'admin' && (
                <Link href="/admin" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-colors">
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome back, {user.name}!</h2>
          <p className="text-slate-600">Manage your recipes and profile</p>
        </div>

        {/* User Stats */}
        {userStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-amber-100">
              <div className="text-3xl font-bold text-amber-600 mb-2">{userStats.totalRecipes}</div>
              <div className="text-slate-600">Total Recipes</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
              <div className="text-3xl font-bold text-green-600 mb-2">{userStats.approvedRecipes}</div>
              <div className="text-slate-600">Approved Recipes</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-yellow-100">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{userStats.pendingRecipes}</div>
              <div className="text-slate-600">Pending Recipes</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
              <div className="text-3xl font-bold text-blue-600 mb-2">{userStats.totalGenerated}</div>
              <div className="text-slate-600">Recipes Generated</div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Recipe Management</h3>
              <p className="text-slate-600">Add new recipes or manage existing ones</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl transition-colors font-semibold"
              >
                Add New Recipe
              </button>
              {user.role === 'premium' && (
                <Link href="/blog/write" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-colors font-semibold">
                  Write Blog Post
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* User Recipes */}
        <div className="bg-white rounded-xl shadow-lg border border-amber-100">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-xl font-bold text-slate-800">Your Recipes</h3>
          </div>
          <div className="p-6">
            {userRecipes.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-slate-800 mb-2">No recipes yet</h4>
                <p className="text-slate-600 mb-4">Start by adding your first recipe!</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl transition-colors font-semibold"
                >
                  Add Your First Recipe
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userRecipes.map((recipe) => (
                  <div key={recipe.id} className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-slate-800 mb-1">{recipe.title}</h4>
                        <p className="text-slate-600 text-sm mb-2">{recipe.description}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            {recipe.cookingTime} min
                          </span>
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            {recipe.cuisine}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            recipe.isApproved || recipe.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {recipe.isApproved || recipe.status === 'approved' ? 'Approved' : 'Pending'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleEditRecipe(recipe)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRecipe(recipe.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-center text-sm font-medium">{error}</p>
          </div>
        )}
      </main>

      {/* Add Recipe Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-800">Add New Recipe</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <AddRecipeForm
                onSuccess={handleAddRecipe}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Recipe Modal */}
      {editingRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-800">Edit Recipe</h2>
                <button
                  onClick={() => setEditingRecipe(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <UserRecipeEditor
                recipe={editingRecipe}
                onSave={handleSaveRecipe}
                onCancel={() => setEditingRecipe(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
