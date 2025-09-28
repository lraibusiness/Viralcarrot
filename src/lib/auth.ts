import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

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

export interface AuthSession {
  user: User;
  token: string;
}

// File paths
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
const RECIPES_FILE = path.join(process.cwd(), 'data', 'recipes.json');

// Helper functions for file operations
function loadUsers(): User[] {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    const users = JSON.parse(data);
    // Convert date strings back to Date objects
    return users.map((user: any) => ({
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt)
    }));
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
}

function saveUsers(users: User[]): void {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(USERS_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
  }
}

function loadRecipes(): UserRecipe[] {
  try {
    if (!fs.existsSync(RECIPES_FILE)) {
      return [];
    }
    const data = fs.readFileSync(RECIPES_FILE, 'utf8');
    const recipes = JSON.parse(data);
    // Convert date strings back to Date objects
    return recipes.map((recipe: any) => ({
      ...recipe,
      createdAt: new Date(recipe.createdAt),
      updatedAt: new Date(recipe.updatedAt)
    }));
  } catch (error) {
    console.error('Error loading recipes:', error);
    return [];
  }
}

function saveRecipes(recipes: UserRecipe[]): void {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(RECIPES_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(RECIPES_FILE, JSON.stringify(recipes, null, 2));
  } catch (error) {
    console.error('Error saving recipes:', error);
  }
}

// Simple token generation (in production, use JWT)
function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Simple password hashing (in production, use bcrypt)
function hashPassword(password: string): string {
  // This is a simple hash for demo purposes
  // In production, use bcrypt or similar
  return Buffer.from(password).toString('base64');
}

function verifyPassword(password: string, hashedPassword: string): boolean {
  return hashPassword(password) === hashedPassword;
}

export class AuthService {
  static async register(email: string, password: string, name: string): Promise<{ user: User; token: string }> {
    const users = loadUsers();
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists');
    }

    const user: User = {
      id: generateToken(),
      email,
      name,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // In a real app, you'd hash the password
    const token = generateToken();
    
    // Store user with hashed password
    const userWithPassword = {
      ...user,
      password: hashPassword(password),
      token
    };
    
    users.push(userWithPassword as any);
    saveUsers(users);

    console.log(`✅ User registered: ${email}`);
    return { user, token };
  }

  static async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const users = loadUsers();
    const user = users.find(u => u.email === email);
    
    if (!user || !verifyPassword(password, (user as any).password)) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken();
    
    // Update user with new token
    (user as any).token = token;
    user.updatedAt = new Date();
    saveUsers(users);

    console.log(`✅ User logged in: ${email}`);
    return { user, token };
  }

  static async getUserByToken(token: string): Promise<User | null> {
    const users = loadUsers();
    const user = users.find(u => (u as any).token === token);
    return user || null;
  }

  static async verifySession(request: NextRequest): Promise<{ user: User; token: string } | null> {
    try {
      const token = request.cookies.get('auth-token')?.value;
      if (!token) {
        console.log('❌ No auth token found in cookies');
        return null;
      }

      console.log('🔍 Checking token:', token);
      const user = await this.getUserByToken(token);
      if (!user) {
        console.log('❌ Invalid auth token');
        return null;
      }

      console.log('✅ User authenticated:', user.email);
      return { user, token };
    } catch (error) {
      console.error('❌ Session verification error:', error);
      return null;
    }
  }

  static async updateProfile(userId: string, updates: Partial<User['profile']>): Promise<User> {
    const users = loadUsers();
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    
    user.profile = { ...user.profile, ...updates };
    user.updatedAt = new Date();
    saveUsers(users);
    
    return user;
  }

  static async updateSubscription(userId: string, subscription: User['subscription']): Promise<User> {
    const users = loadUsers();
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    
    user.subscription = subscription;
    user.updatedAt = new Date();
    saveUsers(users);
    
    return user;
  }

  static async addUserRecipe(userId: string, recipe: Omit<UserRecipe, 'id' | 'userId' | 'views' | 'likes' | 'createdAt' | 'updatedAt'>): Promise<UserRecipe> {
    const recipes = loadRecipes();
    const newRecipe: UserRecipe = {
      ...recipe,
      id: generateToken(),
      userId,
      views: 0,
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    recipes.push(newRecipe);
    saveRecipes(recipes);
    
    console.log(`✅ Recipe added: ${newRecipe.title}`);
    return newRecipe;
  }

  static async getUserRecipes(userId: string): Promise<UserRecipe[]> {
    const recipes = loadRecipes();
    return recipes.filter(r => r.userId === userId);
  }

  static async getPublicRecipes(): Promise<UserRecipe[]> {
    const recipes = loadRecipes();
    return recipes.filter(r => r.isPublic && r.isApproved);
  }

  static async getTrendingRecipes(): Promise<UserRecipe[]> {
    const recipes = loadRecipes();
    return recipes
      .filter(r => r.isPublic && r.isApproved)
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  }

  static async getNewlyPostedRecipes(): Promise<UserRecipe[]> {
    const recipes = loadRecipes();
    return recipes
      .filter(r => r.isPublic && r.isApproved)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10);
  }

  static async searchRecipesByIngredients(ingredients: string[]): Promise<UserRecipe[]> {
    const recipes = loadRecipes();
    return recipes.filter(r => 
      r.isPublic && r.isApproved &&
      ingredients.some(ingredient => 
        r.ingredients.some(recipeIngredient => 
          recipeIngredient.toLowerCase().includes(ingredient.toLowerCase())
        )
      )
    );
  }

  static async getAllRecipes(): Promise<UserRecipe[]> {
    return loadRecipes();
  }

  static async approveRecipe(recipeId: string): Promise<void> {
    const recipes = loadRecipes();
    const recipe = recipes.find(r => r.id === recipeId);
    if (recipe) {
      recipe.isApproved = true;
      recipe.updatedAt = new Date();
      saveRecipes(recipes);
      console.log(`✅ Recipe approved: ${recipe.title}`);
    }
  }

  static async deleteRecipe(recipeId: string): Promise<void> {
    const recipes = loadRecipes();
    const recipeIndex = recipes.findIndex(r => r.id === recipeId);
    if (recipeIndex !== -1) {
      const recipe = recipes[recipeIndex];
      recipes.splice(recipeIndex, 1);
      saveRecipes(recipes);
      console.log(`✅ Recipe deleted: ${recipe.title}`);
    }
  }

  static async getAllUsers(): Promise<User[]> {
    return loadUsers();
  }

  static async updateUserRole(userId: string, role: User['role']): Promise<void> {
    const users = loadUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.role = role;
      user.updatedAt = new Date();
      saveUsers(users);
      console.log(`✅ User role updated: ${user.email} -> ${role}`);
    }
  }

  static async deleteUser(userId: string): Promise<void> {
    const users = loadUsers();
    const recipes = loadRecipes();
    
    // Delete user
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      const user = users[userIndex];
      users.splice(userIndex, 1);
      saveUsers(users);
      console.log(`✅ User deleted: ${user.email}`);
    }
    
    // Delete all user's recipes
    const userRecipes = recipes.filter(r => r.userId === userId);
    const remainingRecipes = recipes.filter(r => r.userId !== userId);
    saveRecipes(remainingRecipes);
    console.log(`✅ Deleted ${userRecipes.length} recipes for user ${userId}`);
  }
}

// Middleware to check authentication (FIXED: Better cookie handling)
export async function requireAuth(request: NextRequest): Promise<User | null> {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    console.log('❌ No auth token found in cookies');
    return null;
  }

  console.log('🔍 Checking token:', token);
  const user = await AuthService.getUserByToken(token);
  if (!user) {
    console.log('❌ Invalid auth token');
  }
  
  return user;
}

// Middleware to check admin role
export async function requireAdmin(request: NextRequest): Promise<User | null> {
  const user = await requireAuth(request);
  if (!user || user.role !== 'admin') return null;
  return user;
}
