import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'premium';
  subscription?: {
    plan: 'free' | 'premium' | 'pro';
    status: 'active' | 'cancelled' | 'expired';
    expiresAt?: Date;
  };
  profile?: {
    bio?: string;
    website?: string;
    socialLinks?: {
      instagram?: string;
      twitter?: string;
      youtube?: string;
    };
    preferences?: {
      cuisine: string[];
      dietaryRestrictions: string[];
      cookingSkill: 'beginner' | 'intermediate' | 'advanced';
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRecipe {
  id: string;
  userId: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  cookingTime: number;
  cuisine: string;
  mealType: string;
  dietaryStyle: string;
  image: string;
  website?: string;
  sourceUrl?: string;
  isPublic: boolean;
  isApproved: boolean;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

// Mock user database (in production, use a real database)
const users: User[] = [];
const userRecipes: UserRecipe[] = [];

export class AuthService {
  // Register new user
  static async register(email: string, password: string, name: string): Promise<{ user: User; token: string }> {
    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const user: User = {
      id: `user_${Date.now()}`,
      email,
      name,
      role: 'user',
      subscription: {
        plan: 'free',
        status: 'active'
      },
      profile: {
        preferences: {
          cuisine: [],
          dietaryRestrictions: [],
          cookingSkill: 'beginner'
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    users.push(user);

    // Generate token (in production, use JWT)
    const token = `token_${user.id}_${Date.now()}`;

    return { user, token };
  }

  // Login user
  static async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // In production, verify password hash
    const token = `token_${user.id}_${Date.now()}`;

    return { user, token };
  }

  // Get user by token
  static async getUserByToken(token: string): Promise<User | null> {
    const userId = token.split('_')[1];
    return users.find(u => u.id === userId) || null;
  }

  // Update user profile
  static async updateProfile(userId: string, updates: Partial<User['profile']>): Promise<User> {
    const user = users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.profile = { ...user.profile, ...updates };
    user.updatedAt = new Date();

    return user;
  }

  // Update subscription
  static async updateSubscription(userId: string, subscription: User['subscription']): Promise<User> {
    const user = users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.subscription = subscription;
    user.updatedAt = new Date();

    return user;
  }

  // Add user recipe
  static async addUserRecipe(userId: string, recipe: Omit<UserRecipe, 'id' | 'userId' | 'views' | 'likes' | 'createdAt' | 'updatedAt'>): Promise<UserRecipe> {
    const userRecipe: UserRecipe = {
      id: `recipe_${Date.now()}`,
      userId,
      ...recipe,
      views: 0,
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    userRecipes.push(userRecipe);
    return userRecipe;
  }

  // Get user recipes
  static async getUserRecipes(userId: string): Promise<UserRecipe[]> {
    return userRecipes.filter(r => r.userId === userId);
  }

  // Get all public recipes
  static async getPublicRecipes(): Promise<UserRecipe[]> {
    return userRecipes.filter(r => r.isPublic && r.isApproved);
  }

  // Get trending recipes
  static async getTrendingRecipes(): Promise<UserRecipe[]> {
    return userRecipes
      .filter(r => r.isPublic && r.isApproved)
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  }

  // Get newly posted recipes
  static async getNewlyPostedRecipes(): Promise<UserRecipe[]> {
    return userRecipes
      .filter(r => r.isPublic && r.isApproved)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10);
  }

  // Admin functions
  static async getAllRecipes(): Promise<UserRecipe[]> {
    return userRecipes;
  }

  static async approveRecipe(recipeId: string): Promise<void> {
    const recipe = userRecipes.find(r => r.id === recipeId);
    if (recipe) {
      recipe.isApproved = true;
      recipe.updatedAt = new Date();
    }
  }

  static async deleteRecipe(recipeId: string): Promise<void> {
    const index = userRecipes.findIndex(r => r.id === recipeId);
    if (index !== -1) {
      userRecipes.splice(index, 1);
    }
  }

  static async getAllUsers(): Promise<User[]> {
    return users;
  }

  static async updateUserRole(userId: string, role: User['role']): Promise<void> {
    const user = users.find(u => u.id === userId);
    if (user) {
      user.role = role;
      user.updatedAt = new Date();
    }
  }
}

// Middleware to check authentication
export async function requireAuth(request: NextRequest): Promise<User | null> {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) return null;

  return await AuthService.getUserByToken(token);
}

// Middleware to check admin role
export async function requireAdmin(request: NextRequest): Promise<User | null> {
  const user = await requireAuth(request);
  if (!user || user.role !== 'admin') return null;
  return user;
}
