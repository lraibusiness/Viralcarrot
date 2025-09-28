'use client';

import { useState, useEffect } from 'react';
import Overview from './Overview';
import UserManagement from './UserManagement';
import RecipeModeration from './RecipeModeration';
import PendingApproval from './PendingApproval';
import Analytics from './Analytics';

type TabType = 'overview' | 'users' | 'recipes' | 'pending' | 'analytics';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    pendingRecipes: 0,
    approvedRecipes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersResponse, recipesResponse] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/recipes')
      ]);

      if (usersResponse.ok && recipesResponse.ok) {
        const usersData = await usersResponse.json();
        const recipesData = await recipesResponse.json();
        
        setStats({
          totalUsers: usersData.users?.length || 0,
          totalRecipes: recipesData.recipes?.length || 0,
          pendingRecipes: recipesData.recipes?.filter((r: any) => !r.isApproved)?.length || 0,
          approvedRecipes: recipesData.recipes?.filter((r: any) => r.isApproved)?.length || 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'recipes', label: 'Recipes', icon: '🍽️' },
    { id: 'pending', label: 'Pending', icon: '⏳' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Tab Navigation */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && <Overview stats={stats} />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'recipes' && <RecipeModeration />}
        {activeTab === 'pending' && <PendingApproval />}
        {activeTab === 'analytics' && <Analytics />}
      </div>
    </div>
  );
}
