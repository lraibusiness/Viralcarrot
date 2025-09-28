'use client';

import { useState, useEffect } from 'react';

interface AnalyticsData {
  totalUsers: number;
  totalRecipes: number;
  approvedRecipes: number;
  pendingRecipes: number;
  popularCuisines: { cuisine: string; count: number }[];
  recentActivity: { type: string; description: string; timestamp: string }[];
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalRecipes: 0,
    approvedRecipes: 0,
    pendingRecipes: 0,
    popularCuisines: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [usersResponse, recipesResponse] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/recipes')
      ]);

      if (usersResponse.ok && recipesResponse.ok) {
        const usersData = await usersResponse.json();
        const recipesData = await recipesResponse.json();
        
        const recipes = recipesData.recipes || [];
        const approvedRecipes = recipes.filter((r: any) => r.isApproved);
        const pendingRecipes = recipes.filter((r: any) => !r.isApproved);
        
        // Calculate popular cuisines
        const cuisineCount: { [key: string]: number } = {};
        recipes.forEach((recipe: any) => {
          if (recipe.cuisine) {
            cuisineCount[recipe.cuisine] = (cuisineCount[recipe.cuisine] || 0) + 1;
          }
        });
        
        const popularCuisines = Object.entries(cuisineCount)
          .map(([cuisine, count]) => ({ cuisine, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setAnalytics({
          totalUsers: usersData.users?.length || 0,
          totalRecipes: recipes.length,
          approvedRecipes: approvedRecipes.length,
          pendingRecipes: pendingRecipes.length,
          popularCuisines,
          recentActivity: [
            { type: 'recipe', description: 'New recipe submitted', timestamp: new Date().toISOString() },
            { type: 'user', description: 'New user registered', timestamp: new Date().toISOString() },
            { type: 'approval', description: 'Recipe approved', timestamp: new Date().toISOString() }
          ]
        });
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
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
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Platform Analytics</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total Users</p>
              <p className="text-2xl font-bold text-blue-900">{analytics.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">🍽️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Total Recipes</p>
              <p className="text-2xl font-bold text-green-900">{analytics.totalRecipes}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">Approved</p>
              <p className="text-2xl font-bold text-purple-900">{analytics.approvedRecipes}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">{analytics.pendingRecipes}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Cuisines */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Popular Cuisines</h3>
          {analytics.popularCuisines.length > 0 ? (
            <div className="space-y-3">
              {analytics.popularCuisines.map((item, index) => (
                <div key={item.cuisine} className="flex items-center justify-between">
                  <span className="text-slate-700 capitalize">{item.cuisine}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-amber-500 h-2 rounded-full" 
                        style={{ width: `${(item.count / analytics.popularCuisines[0].count) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-slate-600">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No cuisine data available</p>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {analytics.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'recipe' ? 'bg-blue-500' :
                  activity.type === 'user' ? 'bg-green-500' : 'bg-purple-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-slate-800">{activity.description}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
