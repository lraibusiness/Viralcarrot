'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  sourceUrl?: string;
  isPublic: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [userRecipes, setUserRecipes] = useState<UserRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchUserRecipes();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/auth/login');
    } finally {
      setUserLoading(false);
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
      console.error('Failed to fetch user recipes:', error);
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

  if (userLoading) {
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
              <h1 className="text-2xl font-bold text-slate-800">ViralCarrot</h1>
            </div>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome back, {user.name}!</h1>
          <p className="text-slate-600">Manage your recipes and profile settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Profile</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Name</label>
                  <p className="text-slate-900">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Email</label>
                  <p className="text-slate-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Role</label>
                  <p className="text-slate-900 capitalize">{user.role}</p>
                </div>
                {user.subscription && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Subscription</label>
                    <p className="text-slate-900">{user.subscription.plan} - {user.subscription.status}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recipe Management Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Add New Recipe</h2>
              <AddRecipeForm onRecipeAdded={fetchUserRecipes} />
            </div>

            {/* User Recipes */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Your Recipes ({userRecipes.length})</h2>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : userRecipes.length > 0 ? (
                <div className="space-y-4">
                  {userRecipes.map((recipe) => (
                    <div key={recipe.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800 mb-1">{recipe.title}</h3>
                          <p className="text-sm text-slate-600 mb-2">{recipe.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-slate-500">
                            <span>{recipe.cookingTime} min</span>
                            <span>{recipe.cuisine}</span>
                            <span>{recipe.mealType}</span>
                            <span className={`px-2 py-1 rounded-full ${
                              recipe.isApproved 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {recipe.isApproved ? 'Approved' : 'Pending'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          {recipe.image && (
                            <img
                              src={recipe.image}
                              alt={recipe.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500">No recipes yet. Add your first recipe above!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
