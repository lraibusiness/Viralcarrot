'use client';

import { useState, useEffect } from 'react';
import BlogEditor from './BlogEditor';

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

export default function BlogManagement() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch('/api/blog/posts');
      if (response.ok) {
        const data = await response.json();
        setBlogPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePost = async (postId: string) => {
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
      }
    } catch (error) {
      console.error('Error approving blog post:', error);
    }
  };

  const handleRejectPost = async (postId: string) => {
    try {
      const response = await fetch(`/api/admin/blog/${postId}/reject`, {
        method: 'PUT',
      });

      if (response.ok) {
        setBlogPosts(prev => prev.filter(post => post.id !== postId));
      }
    } catch (error) {
      console.error('Error rejecting blog post:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
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

  const handleSaveEdit = async (updatedPost: BlogPost) => {
    try {
      const response = await fetch(`/api/admin/blog/${updatedPost.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost)
      });

      if (response.ok) {
        setBlogPosts(prev => prev.map(post => 
          post.id === updatedPost.id ? updatedPost : post
        ));
        setEditingPost(null);
      } else {
        alert('Failed to update blog post. Please try again.');
      }
    } catch (error) {
      console.error('Error updating blog post:', error);
      alert('Failed to update blog post. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Blog Management</h2>
        <div className="text-sm text-slate-600">
          {blogPosts.length} total posts
        </div>
      </div>

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
                      onClick={() => handleApprovePost(post.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectPost(post.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => setEditingPost(post)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
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

      {/* Blog Editor Modal */}
      {editingPost && (
        <BlogEditor
          post={editingPost}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
}
