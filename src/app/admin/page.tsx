'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  totalRecipesGenerated?: number;
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
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  coverImage: string;
  authorName: string;
  tags: string[];
  createdAt: string;
  isPublished: boolean;
  status: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'recipes' | 'blogs'>('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecipes: 0,
    totalBlogPosts: 0,
    pendingRecipes: 0,
    pendingBlogPosts: 0,
    premiumUsers: 0
  });
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
    fetchAllData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        if (data.user.role !== 'admin') {
          router.push('/');
        }
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

  const fetchAllData = async () => {
    try {
      // Fetch users
      const usersResponse = await fetch('/api/admin/users');
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users);
      }

      // Fetch recipes
      const recipesResponse = await fetch('/api/admin/recipes');
      if (recipesResponse.ok) {
        const recipesData = await recipesResponse.json();
        setRecipes(recipesData.recipes);
      }

      // Fetch blog posts
      const blogResponse = await fetch('/api/blog/posts');
      if (blogResponse.ok) {
        const blogData = await blogResponse.json();
        setBlogPosts(blogData.posts);
      }

      // Calculate stats
      const usersData = await usersResponse.json();
      const recipesData = await recipesResponse.json();
      const blogData = await blogResponse.json();

      setStats({
        totalUsers: usersData.users.length,
        totalRecipes: recipesData.recipes.length,
        totalBlogPosts: blogData.posts.length,
        pendingRecipes: recipesData.recipes.filter((r: Recipe) => r.status === 'pending').length,
        pendingBlogPosts: blogData.posts.filter((b: BlogPost) => !b.isPublished).length,
        premiumUsers: usersData.users.filter((u: User) => u.role === 'premium').length
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const handleApproveRecipe = async (recipeId: string) => {
    try {
      const response = await fetch(`/api/admin/recipes/${recipeId}/approve`, {
        method: 'PUT',
      });

      if (response.ok) {
        setRecipes(prev => prev.map(recipe => 
          recipe.id === recipeId 
            ? { ...recipe, status: 'approved', isApproved: true }
            : recipe
        ));
        setStats(prev => ({ ...prev, pendingRecipes: prev.pendingRecipes - 1 }));
      }
    } catch (error) {
      console.error('Error approving recipe:', error);
    }
  };

  const handleRejectRecipe = async (recipeId: string) => {
    try {
      const response = await fetch(`/api/admin/recipes/${recipeId}/reject`, {
        method: 'PUT',
      });

      if (response.ok) {
        setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
        setStats(prev => ({ ...prev, pendingRecipes: prev.pendingRecipes - 1 }));
      }
    } catch (error) {
      console.error('Error rejecting recipe:', error);
    }
  };

  const handleApproveBlogPost = async (postId: string) => {
    try {
      const response = await fetch(`/api/admin/blog/${postId}/approve`, {
        method: 'PUT',
      });

      if (response.ok) {
        setBlogPosts(prev => prev.map(post => 
          post.id === postId 
            ? { ...post, isPublished: true, status: 'published' }
            : post
        ));
        setStats(prev => ({ ...prev, pendingBlogPosts: prev.pendingBlogPosts - 1 }));
      }
    } catch (error) {
      console.error('Error approving blog post:', error);
    }
  };

  const handleRejectBlogPost = async (postId: string) => {
    try {
      const response = await fetch(`/api/admin/blog/${postId}/reject`, {
        method: 'PUT',
      });

      if (response.ok) {
        setBlogPosts(prev => prev.filter(post => post.id !== postId));
        setStats(prev => ({ ...prev, pendingBlogPosts: prev.pendingBlogPosts - 1 }));
      }
    } catch (error) {
      console.error('Error rejecting blog post:', error);
    }
  };

  const handleDeleteBlogPost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBlogPosts(prev => prev.filter(post => post.id !== postId));
      }
    } catch (error) {
      console.error('Error deleting blog post:', error);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
        fetchAllData(); // Refresh stats
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Access Denied</h1>
          <p className="text-slate-600 mb-6">Admin access required.</p>
          <Link href="/" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg transition-colors">
            Go Home
          </Link>
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
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800">ViralCarrot Admin</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-slate-600 hover:text-amber-600 transition-colors">Home</Link>
              <Link href="/dashboard" className="text-slate-600 hover:text-amber-600 transition-colors">Dashboard</Link>
              <button
                onClick={() => {
                  fetch('/api/auth/logout', { method: 'POST' });
                  router.push('/');
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
              <p className="text-slate-600">Manage users, recipes, and blog content</p>
            </div>
            <div className="text-right">
              <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg font-semibold">
                Admin Access
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-slate-800">{stats.totalUsers}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Premium Users</p>
                <p className="text-3xl font-bold text-slate-800">{stats.premiumUsers}</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-xl">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Pending Reviews</p>
                <p className="text-3xl font-bold text-slate-800">{stats.pendingRecipes + stats.pendingBlogPosts}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-xl">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 mb-8">
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'users'
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('recipes')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'recipes'
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Recipes
            </button>
            <button
              onClick={() => setActiveTab('blogs')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'blogs'
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Blog Posts
            </button>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">New User Registration</p>
                    <p className="text-xs text-slate-600">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">New Recipe Submitted</p>
                    <p className="text-xs text-slate-600">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Recipe Approved</p>
                    <p className="text-xs text-slate-600">6 hours ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab('recipes')}
                  className="w-full text-left p-4 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">Review Pending Recipes</p>
                      <p className="text-sm text-slate-600">{stats.pendingRecipes} recipes waiting</p>
                    </div>
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('blogs')}
                  className="w-full text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">Review Blog Posts</p>
                      <p className="text-sm text-slate-600">{stats.pendingBlogPosts} posts waiting</p>
                    </div>
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className="w-full text-left p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">Manage Users</p>
                      <p className="text-sm text-slate-600">{stats.totalUsers} total users</p>
                    </div>
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">User Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-800">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-800">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-800">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-800">Recipes</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-slate-100">
                      <td className="py-3 px-4 text-slate-800">{user.name}</td>
                      <td className="py-3 px-4 text-slate-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                          className="border border-slate-300 rounded-lg px-2 py-1 text-sm"
                        >
                          <option value="user">User</option>
                          <option value="premium">Premium</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{user.totalRecipesGenerated || 0}</td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-slate-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'recipes' && (
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Recipe Management</h2>
            <div className="space-y-4">
              {recipes.filter(recipe => recipe.status === 'pending').map((recipe) => (
                <div key={recipe.id} className="border border-slate-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">{recipe.title}</h3>
                      <p className="text-slate-600 mb-2">{recipe.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <span>{recipe.cookingTime} min</span>
                        <span>{recipe.cuisine}</span>
                        <span>By {recipe.createdBy}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleApproveRecipe(recipe.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectRecipe(recipe.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {recipes.filter(recipe => recipe.status === 'pending').length === 0 && (
                <div className="text-center py-8">
                  <p className="text-slate-600">No pending recipes to review</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'blogs' && (
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Blog Post Management</h2>
            <div className="space-y-4">
              {blogPosts.map((post) => (
                <div key={post.id} className="border border-slate-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">{post.title}</h3>
                      <p className="text-slate-600 mb-2">By {post.authorName}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-500 mb-3">
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          post.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.isPublished ? 'Published' : 'Pending Review'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag) => (
                          <span key={tag} className="bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      {!post.isPublished && (
                        <>
                          <button
                            onClick={() => handleApproveBlogPost(post.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectBlogPost(post.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteBlogPost(post.id)}
                        className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {blogPosts.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-slate-600">No blog posts found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
