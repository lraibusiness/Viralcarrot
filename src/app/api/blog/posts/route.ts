import { NextRequest, NextResponse } from 'next/server';
import { AuthService, requireAuth } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';

const BLOG_POSTS_FILE = path.join(process.cwd(), 'data', 'blog-posts.json');

interface BlogPost {
  id: string;
  title: string;
  content: string;
  coverImage: string;
  authorId: string;
  authorName: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  seoDescription?: string;
  readTime?: string;
}

async function loadBlogPosts(): Promise<BlogPost[]> {
  try {
    const data = await fs.readFile(BLOG_POSTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    console.error('Error loading blog posts:', error);
    return [];
  }
}

async function saveBlogPosts(posts: BlogPost[]): Promise<void> {
  await fs.writeFile(BLOG_POSTS_FILE, JSON.stringify(posts, null, 2));
}

export async function GET(request: NextRequest) {
  try {
    const posts = await loadBlogPosts();
    // Only return published posts for public view
    const publishedPosts = posts.filter(p => p.isPublished);
    
    // Sort by creation date (newest first)
    publishedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return NextResponse.json({ 
      success: true, 
      posts: publishedPosts,
      total: publishedPosts.length
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch blog posts' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user || user.role !== 'premium') {
      return NextResponse.json(
        { success: false, error: 'Premium access required to create blog posts' },
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

    const posts = await loadBlogPosts();
    const newPost: BlogPost = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      content,
      coverImage: coverImage || '',
      authorId: user.id,
      authorName: user.name,
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished: false, // Posts need admin approval before publishing
    };

    posts.push(newPost);
    await saveBlogPosts(posts);

    return NextResponse.json({ 
      success: true, 
      message: 'Blog post submitted for review', 
      post: newPost 
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create blog post' 
    }, { status: 500 });
  }
}
