import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await context.params;
    const posts = await loadBlogPosts();
    const post = posts.find(p => p.id === postId && p.isPublished);

    if (!post) {
      return NextResponse.json({ 
        success: false, 
        error: 'Blog post not found or not published' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      post 
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch blog post' 
    }, { status: 500 });
  }
}
