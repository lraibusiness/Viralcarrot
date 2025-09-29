import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await AuthService.verifySession(request);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Read users from file
    const usersPath = join(process.cwd(), 'data', 'users.json');
    let users = [];
    try {
      const data = await readFile(usersPath, 'utf8');
      users = JSON.parse(data);
    } catch (error) {
      console.error('Error reading users:', error);
      return NextResponse.json({ success: false, error: 'Failed to read users' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      users: users
    });

  } catch (error) {
    console.error('Admin users API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await AuthService.verifySession(request);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    const { id, ...userUpdates } = updates;

    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    // Read current users
    const usersPath = join(process.cwd(), 'data', 'users.json');
    let users = [];
    try {
      const data = await readFile(usersPath, 'utf8');
      users = JSON.parse(data);
    } catch (error) {
      console.error('Error reading users:', error);
      return NextResponse.json({ success: false, error: 'Failed to read users' }, { status: 500 });
    }

    // Find and update user
    const userIndex = users.findIndex((u: unknown) => u.id === id);
    if (userIndex === -1) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Update user
    users[userIndex] = {
      ...users[userIndex],
      ...userUpdates,
      updatedAt: new Date().toISOString()
    };

    // Save updated users
    await writeFile(usersPath, JSON.stringify(users, null, 2));

    return NextResponse.json({
      success: true,
      user: users[userIndex]
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await AuthService.verifySession(request);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    // Prevent admin from deleting themselves
    if (userId === session.user.id) {
      return NextResponse.json({ success: false, error: 'Cannot delete your own account' }, { status: 400 });
    }

    // Read current users
    const usersPath = join(process.cwd(), 'data', 'users.json');
    let users = [];
    try {
      const data = await readFile(usersPath, 'utf8');
      users = JSON.parse(data);
    } catch (error) {
      console.error('Error reading users:', error);
      return NextResponse.json({ success: false, error: 'Failed to read users' }, { status: 500 });
    }

    // Find and remove user
    const userIndex = users.findIndex((u: unknown) => u.id === userId);
    if (userIndex === -1) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    users.splice(userIndex, 1);

    // Save updated users
    await writeFile(usersPath, JSON.stringify(users, null, 2));

    // Also remove user's recipes
    const recipesPath = join(process.cwd(), 'data', 'recipes.json');
    let recipes = [];
    try {
      const data = await readFile(recipesPath, 'utf8');
      recipes = JSON.parse(data);
    } catch (error) {
      console.error('Error reading recipes:', error);
    }

    // Remove recipes created by this user
    const userEmail = users[userIndex]?.email;
    if (userEmail) {
      recipes = recipes.filter((r: unknown) => r.createdBy !== userEmail);
      await writeFile(recipesPath, JSON.stringify(recipes, null, 2));
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
