'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  subscription?: {
    plan: string;
    status: string;
  };
  createdAt: string;
}

interface UserRecipe {
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
  isApproved: boolean;
  views: number;
  likes: number;
  createdAt: string;
}

export default function AdminPortal() {
  const [users, setUsers] = useState<User[]>([]);
  const [recipes, setRecipes] = useState<UserRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [usersResponse, recipesResponse] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/recipes')
      ]);

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users);
      }

      if (recipesResponse.ok) {
        const recipesData = await recipesResponse.json();
        setRecipes(recipesData.recipes);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRecipe = async (recipeId: string) => {
    try {
      await fetch(`/api/admin/recipes/approve?id=${recipeId}`, { method: 'POST' });
      setRecipes(recipes.map(recipe => 
        recipe.id === recipeId ? { ...recipe, isApproved: true } : recipe
      ));
    } catch (error) {
      console.error('Error approving recipe:', error);
    }
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    try {
      await fetch(`/api/admin/recipes?id=${recipeId}`, { method: 'DELETE' });
      setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const handleUpdateUserRole = async (userId: string, role: string) => {
    try {
      await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role })
      });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role } : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800">Admin Portal</h1>
            </div>
            <button
              onClick={() => router.push('/')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-colors"
            >
              Back to Site
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex space-x-1 bg-slate-100 rounded-xl p-1">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'users', label: 'Users' },
              { id: 'recipes', label: 'Recipes' },
              { id: 'settings', label: 'Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-amber-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-amber-600">{users.length}</p>
              <p className="text-slate-600 text-sm">Registered users</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Total Recipes</h3>
              <p className="text-3xl font-bold text-amber-600">{recipes.length}</p>
              <p className="text-slate-600 text-sm">User recipes</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Pending Approval</h3>
              <p className="text-3xl font-bold text-amber-600">
                {recipes.filter(r => !r.isApproved).length}
              </p>
              <p className="text-slate-600 text-sm">Awaiting review</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Premium Users</h3>
              <p className="text-3xl font-bold text-amber-600">
                {users.filter(u => u.subscription?.plan === 'premium').length}
              </p>
              <p className="text-slate-600 text-sm">Paid subscribers</p>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">User Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-800">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-800">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-800">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-800">Subscription</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-slate-100">
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                          className="bg-slate-100 rounded-lg px-2 py-1 text-sm"
                        >
                          <option value="user">User</option>
                          <option value="premium">Premium</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.subscription?.plan === 'premium' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {user.subscription?.plan || 'free'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-red-600 hover:text-red-800 text-sm">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'recipes' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Recipe Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="border border-slate-200 rounded-xl p-4">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-slate-800 mb-2">{recipe.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{recipe.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      recipe.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {recipe.isApproved ? 'Approved' : 'Pending'}
                    </span>
                    <span className="text-sm text-slate-500">{recipe.views} views</span>
                  </div>
                  <div className="flex space-x-2">
                    {!recipe.isApproved && (
                      <button
                        onClick={() => handleApproveRecipe(recipe.id)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteRecipe(recipe.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Site Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Site Name</label>
                <input
                  type="text"
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  defaultValue="ViralCarrot"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Site Description</label>
                <textarea
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  rows={3}
                  defaultValue="Smart recipe discovery with ingredient matching and popular recipes from the web."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Admin Email</label>
                <input
                  type="email"
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  defaultValue="admin@viralcarrot.com"
                />
              </div>
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl transition-colors">
                Save Settings
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
