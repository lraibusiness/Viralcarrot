'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MobileNav from '@/components/MobileNav';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  coverImage: string;
  authorName: string;
  tags: string[];
  createdAt: string;
  seoDescription?: string;
  readTime?: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<{ id: string; email: string; name: string; role: string; subscription?: string } | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog/posts');
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.posts);
      } else {
        setError('Failed to load blog posts');
      }
    } catch (err) {
      setError('Error loading blog posts');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading articles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchPosts}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
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
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/" className="text-slate-600 hover:text-amber-600 transition-colors">Home</Link>
                <Link href="/about" className="text-slate-600 hover:text-amber-600 transition-colors">About</Link>
                <Link href="/contact" className="text-slate-600 hover:text-amber-600 transition-colors">Contact</Link>
                <Link href="/blog" className="text-amber-600 font-semibold transition-colors">Blog</Link>
              </nav>

              {/* Mobile Navigation */}
              <MobileNav 
                user={user}
                onLogin={() => {/* Add login handler if needed */}}
                onLogout={() => {/* Add logout handler if needed */}}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 mb-3 md:mb-4">Food Thoughts</h1>
          <p className="text-sm md:text-xl text-slate-600 max-w-2xl mx-auto mb-6 md:mb-8 px-4">
            Discover culinary insights, cooking techniques, and food stories from our passionate community of chefs and food enthusiasts.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-6 md:mb-8">
            <span className="bg-amber-100 text-amber-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">Cooking Tips</span>
            <span className="bg-orange-100 text-orange-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">Nutrition</span>
            <span className="bg-green-100 text-green-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">Healthy Living</span>
            <span className="bg-blue-100 text-blue-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm">Food Science</span>
          </div>
        </div>

        {/* AdSense Ad Placeholder - Top of Content */}
        <div className="mb-8 p-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 text-center">
          <p className="text-gray-500 text-sm">Advertisement Space</p>
          <p className="text-xs text-gray-400">Google AdSense compatible</p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-12">
          {posts.map((post, index) => (
            <React.Fragment key={post.id}>
              <Link href={`/blog/${post.id}`} className="block">
                <article className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-amber-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105">
                  <div className="relative h-40 md:h-48 w-full">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <span className="text-xs md:text-sm text-slate-500">{post.authorName}</span>
                      <span className="text-xs md:text-sm text-slate-500">{formatDate(post.createdAt)}</span>
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2 md:mb-3 line-clamp-2 hover:text-amber-600 transition-colors">{post.title}</h2>
                    <p className="text-slate-600 mb-4 line-clamp-3">
                      {post.seoDescription || 'Discover more about this fascinating topic...'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">{post.readTime || '5 min read'}</span>
                    </div>
                    <div className="mt-4 inline-flex items-center text-amber-600 font-semibold">
                      Read More
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </div>
                  </div>
                </article>
              </Link>
              
              {/* AdSense Ad Placeholder - Every 3rd article */}
              {(index + 1) % 3 === 0 && (
                <div className="md:col-span-2 lg:col-span-3 p-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 text-center">
                  <p className="text-gray-500 text-sm">Advertisement Space</p>
                  <p className="text-xs text-gray-400">Google AdSense compatible</p>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* AdSense Ad Placeholder - Bottom of Content */}
        <div className="mb-8 p-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 text-center">
          <p className="text-gray-500 text-sm">Advertisement Space</p>
          <p className="text-xs text-gray-400">Google AdSense compatible</p>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Stay Updated with Food Thoughts</h3>
          <p className="mb-6 opacity-90">
            Get the latest cooking tips, nutrition insights, and food stories delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-amber-600 font-semibold px-6 py-3 rounded-lg hover:bg-amber-50 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">ViralCarrot</h3>
              <p className="text-slate-300 text-sm">
                Discover amazing recipes and cooking techniques with our smart recipe generator.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-300">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                <li><Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <p className="text-slate-300 text-sm mb-4">
                Follow us for daily cooking inspiration and tips.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.762 4.83 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.815 3.708 13.664 3.708 12.367s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.324c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.928-.175-1.297-.49-.368-.315-.49-.753-.49-1.243s.122-.928.49-1.243c.369-.315.807-.49 1.297-.49s.928.175 1.297.49c.368.315.49.753.49 1.243s-.122.928-.49 1.243c-.369.315-.807.49-1.297.49z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 ViralCarrot. All rights reserved. | <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link> | <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
