'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

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

export default function BlogPostPage() {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const params = useParams();
  const postId = params.postId as string;

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/blog/posts/${postId}`);
      const data = await response.json();
      
      if (data.success) {
        setPost(data.post);
      } else {
        setError('Blog post not found');
      }
    } catch (err) {
      setError('Error loading blog post');
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

  const shareOnSocial = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post?.title || '');
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'pinterest':
        shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&media=${post?.coverImage}&description=${title}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Article Not Found</h1>
            <p className="text-slate-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
            <Link 
              href="/blog"
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Back to Blog
            </Link>
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
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-slate-600 hover:text-amber-600 transition-colors">Home</Link>
              <Link href="/about" className="text-slate-600 hover:text-amber-600 transition-colors">About</Link>
              <Link href="/contact" className="text-slate-600 hover:text-amber-600 transition-colors">Contact</Link>
              <Link href="/blog" className="text-amber-600 font-semibold transition-colors">Blog</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-slate-600">
            <li><Link href="/" className="hover:text-amber-600 transition-colors">Home</Link></li>
            <li><span className="mx-2">/</span></li>
            <li><Link href="/blog" className="hover:text-amber-600 transition-colors">Blog</Link></li>
            <li><span className="mx-2">/</span></li>
            <li className="text-slate-800 font-medium">{post.title}</li>
          </ol>
        </nav>

        {/* AdSense Ad Placeholder - Top of Article */}
        <div className="mb-8 p-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 text-center">
          <p className="text-gray-500 text-sm">Advertisement Space</p>
          <p className="text-xs text-gray-400">Google AdSense compatible</p>
        </div>

        {/* Article Header with Structured Data */}
        <article className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden" itemScope itemType="https://schema.org/Article">
          <header>
            <div className="relative h-64 md:h-80 w-full">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                itemProp="image"
              />
            </div>
            
            <div className="p-8">
              {/* Article Meta */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <span className="text-slate-600">By <span itemProp="author" itemScope itemType="https://schema.org/Person"><span itemProp="name">{post.authorName}</span></span></span>
                  <span className="text-slate-400">•</span>
                  <time className="text-slate-600" dateTime={post.createdAt} itemProp="datePublished">{formatDate(post.createdAt)}</time>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600" itemProp="timeRequired">{post.readTime || '5 min read'}</span>
                </div>
              </div>

              {/* Article Title */}
              <h1 className="text-4xl font-bold text-slate-800 mb-6 leading-tight" itemProp="headline">
                {post.title}
              </h1>

                             {/* Article Description/Summary */}
               <div className="mb-6 p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                 <p className="text-slate-700 text-lg leading-relaxed" itemProp="description">
                   {post.seoDescription || 'Discover insights and tips in this comprehensive article about food, cooking, and culinary adventures.'}
                 </p>
               </div>
             </div>
           </header>

           <div className="p-8 pt-0">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span key={tag} className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>

            {/* Share Buttons */}
            <div className="flex items-center space-x-4 mb-8 p-4 bg-slate-50 rounded-lg">
              <span className="text-slate-600 font-medium">Share this article:</span>
              <button
                onClick={() => shareOnSocial('facebook')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>
              <button
                onClick={() => shareOnSocial('twitter')}
                className="flex items-center space-x-2 bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.762 4.83 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                <span>Twitter</span>
              </button>
              <button
                onClick={() => shareOnSocial('pinterest')}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.815 3.708 13.664 3.708 12.367s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.324c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.928-.175-1.297-.49-.368-.315-.49-.753-.49-1.243s.122-.928.49-1.243c.369-.315.807-.49 1.297-.49s.928.175 1.297.49c.368.315.49.753.49 1.243s-.122.928-.49 1.243c-.369.315-.807.49-1.297.49z"/>
                </svg>
                <span>Pinterest</span>
              </button>
            </div>

            {/* AdSense Ad Placeholder - Middle of Article */}
            <div className="mb-8 p-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 text-center">
              <p className="text-gray-500 text-sm">Advertisement Space</p>
              <p className="text-xs text-gray-400">Google AdSense compatible</p>
            </div>

            {/* Article Content */}
            <section 
              className="prose prose-lg max-w-none text-slate-700 leading-relaxed prose-headings:text-slate-800 prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:mb-4 prose-ul:mb-4 prose-ol:mb-4 prose-li:mb-2 prose-strong:text-slate-800 prose-a:text-amber-600 prose-a:no-underline hover:prose-a:underline"
              itemProp="articleBody"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* AdSense Ad Placeholder - Bottom of Article */}
            <div className="mt-8 p-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 text-center">
              <p className="text-gray-500 text-sm">Advertisement Space</p>
              <p className="text-xs text-gray-400">Google AdSense compatible</p>
            </div>

            {/* Comments Section */}
            <section className="mt-12 pt-8 border-t border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Comments</h2>
              
              {/* Comment Form */}
              <div className="bg-slate-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Leave a Comment</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                      <input
                        type="text"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-800"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-800"
                        placeholder="Your email (won't be published)"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Comment</label>
                    <textarea
                      rows={4}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-800"
                      placeholder="Share your thoughts..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Post Comment
                  </button>
                </form>
              </div>

              {/* Sample Comments */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">JD</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">John Doe</p>
                        <p className="text-sm text-slate-500">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    Great article! I really enjoyed reading about this topic. The tips you shared are very practical and easy to implement.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">SM</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">Sarah Miller</p>
                        <p className="text-sm text-slate-500">1 day ago</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    Thanks for sharing this! I've been looking for information like this for a while. Your writing style makes it easy to understand.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">More Food Thoughts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/blog" className="group">
              <div className="bg-white rounded-lg shadow-md border border-amber-100 p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-slate-800 group-hover:text-amber-600 transition-colors mb-2">
                  Explore More Articles
                </h3>
                <p className="text-slate-600">
                  Discover more cooking tips, nutrition insights, and food stories from our community.
                </p>
              </div>
            </Link>
            <Link href="/" className="group">
              <div className="bg-white rounded-lg shadow-md border border-amber-100 p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold text-slate-800 group-hover:text-amber-600 transition-colors mb-2">
                  Generate Your Own Recipes
                </h3>
                <p className="text-slate-600">
                  Use our smart recipe generator to create personalized recipes based on your ingredients.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
