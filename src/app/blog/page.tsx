'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';


interface BlogPost {
  id: string;
  title: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string[];
  createdAt: string;
  excerpt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchPosts();
    fetchUserData();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading blog posts...</p>
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
              <h1 className="text-2xl font-bold text-slate-800">ViralCarrot</h1>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-slate-600 hover:text-amber-600 transition-colors">Home</Link>
              <Link href="/blog" className="text-amber-600 font-semibold">Blog</Link>
              <Link href="/premium" className="text-slate-600 hover:text-amber-600 transition-colors">Premium</Link>
              {user ? (
                <Link href="/dashboard" className="text-slate-600 hover:text-amber-600 transition-colors">Dashboard</Link>
              ) : (
                <Link href="/auth/login" className="text-slate-600 hover:text-amber-600 transition-colors">Login</Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Food Thoughts
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Discover cooking tips, recipe ideas, and food stories from our community of passionate cooks.
          </p>
        </div>

        {/* Write Post Button for Premium Users */}
        {user && user.role === 'premium' && (
          <div className="mb-8">
            <Link
              href="/blog/write"
              className="inline-flex items-center bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="mr-2">✍️</span>
              Write New Post
            </Link>
          </div>
        )}

        {/* Blog Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No posts yet</h3>
            <p className="text-slate-600 mb-6">Be the first to share your food thoughts!</p>
            {user && user.role === 'premium' ? (
              <Link
                href="/blog/write"
                className="inline-flex items-center bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Write First Post
              </Link>
            ) : (
              <Link
                href="/premium"
                className="inline-flex items-center bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Upgrade to Write Posts
              </Link>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48">
                  <Image
                    src={post.coverImage || '/api/placeholder/400/200'}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {post.author.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{post.author}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/blog/${post.id}`}
                      className="text-amber-600 hover:text-amber-700 font-medium text-sm"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
