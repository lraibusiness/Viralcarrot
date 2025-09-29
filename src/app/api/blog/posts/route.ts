import { NextRequest, NextResponse } from 'next/server';
import { AuthService, requireAuth } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

const BLOG_POSTS_FILE = path.join(process.cwd(), 'data', 'blog-posts.json');

interface BlogPost {
  id: string;
  title: string;
  content: string;
  coverImage: string;
  author: string;
  authorEmail: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  excerpt: string;
}

function loadBlogPosts(): BlogPost[] {
  try {
    if (!fs.existsSync(BLOG_POSTS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(BLOG_POSTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

function saveBlogPosts(posts: BlogPost[]): void {
  try {
    const dataDir = path.dirname(BLOG_POSTS_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(BLOG_POSTS_FILE, JSON.stringify(posts, null, 2));
  } catch (error) {
    console.error('Error saving blog posts:', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const posts = loadBlogPosts();
    
    // Sort by creation date (newest first)
    const sortedPosts = posts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      success: true,
      posts: sortedPosts
    });

  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user is premium
    if (user.role !== 'premium') {
      return NextResponse.json(
        { success: false, error: 'Premium subscription required to create blog posts' },
        { status: 403 }
      );
    }

    const { title, content, coverImage, tags } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const posts = loadBlogPosts();
    const newPost: BlogPost = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      content,
      coverImage: coverImage || '',
      author: user.name,
      authorEmail: user.email,
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      excerpt: content.substring(0, 150) + (content.length > 150 ? '...' : '')
    };

    posts.push(newPost);
    saveBlogPosts(posts);

    return NextResponse.json({
      success: true,
      post: newPost
    });

  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
