import { NextRequest, NextResponse } from 'next/server';
import { AuthService, requireAdmin } from '@/lib/auth';
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
  status: string;
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

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const user = await requireAdmin(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { postId } = await context.params;
    const posts = await loadBlogPosts();
    const filteredPosts = posts.filter(p => p.id !== postId);
    
    if (posts.length === filteredPosts.length) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      );
    }
    
    await saveBlogPosts(filteredPosts);

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully'
    });

  } catch (error) {
    console.error('Blog post deletion error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
