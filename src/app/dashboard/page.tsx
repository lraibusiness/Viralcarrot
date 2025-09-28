'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddRecipeForm from '@/components/AddRecipeForm';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  subscription?: {
    plan: string;
    status: string;
  };
  profile?: {
    bio?: string;
    website?: string;
    socialLinks?: {
      instagram?: string;
      twitter?: string;
      youtube?: string;
    };
    preferences?: {
      cuisine: string[];
      dietaryRestrictions: string[];
      cookingSkill: string;
    };
  };
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

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [recipes, setRecipes] = useState<UserRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [redirecting, setRedirecting] = useState(false);
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [userResponse, recipesResponse] = await Promise.all([
        fetch('/api/user/profile'),
        fetch('/api/recipes/user')
      ]);

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData.user);
      } else {
        // User not authenticated, redirect to login
        setRedirecting(true);
        router.push('/auth/login');
        return;
      }

      if (recipesResponse.ok) {
        const recipesData = await recipesResponse.json();
        setRecipes(recipesData.recipes);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setRedirecting(true);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleRecipeAdded = () => {
    // Refresh recipes after adding a new one
    fetchUserData();
  };

  // Show loading or redirecting state
  if (loading || redirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">
            {redirecting ? 'Redirecting to login...' : 'Loading your dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  // If no user after loading, show login prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Authentication Required</h2>
          <p className="text-slate-600 mb-6">Please log in to access your dashboard.</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl transition-colors"
          >
            Go to Login
          </button>
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
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800">ViralCarrot</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-600">Welcome, {user.name}</span>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex space-x-1 bg-slate-100 rounded-xl p-1">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'recipes', label: 'My Recipes' },
              { id: 'profile', label: 'Profile Settings' },
              { id: 'subscription', label: 'Subscription' }
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">My Recipes</h3>
              <p className="text-3xl font-bold text-amber-600">{recipes.length}</p>
              <p className="text-slate-600 text-sm">Total recipes created</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Total Views</h3>
              <p className="text-3xl font-bold text-amber-600">
                {recipes.reduce((sum, recipe) => sum + recipe.views, 0)}
              </p>
              <p className="text-slate-600 text-sm">Across all recipes</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Subscription</h3>
              <p className="text-3xl font-bold text-amber-600 capitalize">
                {user.subscription?.plan || 'Free'}
              </p>
              <p className="text-slate-600 text-sm">Current plan</p>
            </div>
          </div>
        )}

        {activeTab === 'recipes' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">My Recipes</h2>
              <button 
                onClick={() => setShowAddRecipe(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl transition-colors"
              >
                Add New Recipe
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-slate-800 mb-2">{recipe.title}</h3>
                  <p className="text-slate-600 text-sm mb-2">{recipe.description}</p>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>{recipe.views} views</span>
                    <span>{recipe.likes} likes</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      recipe.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {recipe.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
              {recipes.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🍽️</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">No recipes yet</h3>
                  <p className="text-slate-600 mb-4">Start sharing your delicious recipes with the community!</p>
                  <button 
                    onClick={() => setShowAddRecipe(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl transition-colors"
                  >
                    Add Your First Recipe
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Profile Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                <textarea
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
                <input
                  type="url"
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="https://your-website.com"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Instagram</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="@yourusername"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Twitter</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="@yourusername"
                  />
                </div>
              </div>
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Subscription Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-slate-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Free</h3>
                <p className="text-3xl font-bold text-slate-800 mb-4">$0<span className="text-lg text-slate-600">/month</span></p>
                <ul className="space-y-2 text-slate-600 mb-6">
                  <li>• 5 recipes per month</li>
                  <li>• Basic recipe features</li>
                  <li>• Community access</li>
                </ul>
                <button className="w-full bg-slate-100 text-slate-700 py-2 px-4 rounded-xl">
                  Current Plan
                </button>
              </div>
              <div className="border border-amber-200 rounded-xl p-6 bg-amber-50">
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Premium</h3>
                <p className="text-3xl font-bold text-slate-800 mb-4">$9<span className="text-lg text-slate-600">/month</span></p>
                <ul className="space-y-2 text-slate-600 mb-6">
                  <li>• Unlimited recipes</li>
                  <li>• Advanced analytics</li>
                  <li>• Priority support</li>
                  <li>• Custom branding</li>
                </ul>
                <button className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-xl transition-colors">
                  Upgrade to Premium
                </button>
              </div>
              <div className="border border-slate-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Pro</h3>
                <p className="text-3xl font-bold text-slate-800 mb-4">$19<span className="text-lg text-slate-600">/month</span></p>
                <ul className="space-y-2 text-slate-600 mb-6">
                  <li>• Everything in Premium</li>
                  <li>• API access</li>
                  <li>• White-label solution</li>
                  <li>• Dedicated support</li>
                </ul>
                <button className="w-full bg-slate-100 text-slate-700 py-2 px-4 rounded-xl">
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Recipe Modal */}
      {showAddRecipe && (
        <AddRecipeForm
          onClose={() => setShowAddRecipe(false)}
          onSuccess={handleRecipeAdded}
        />
      )}
    </div>
  );
}
