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

// File-based persistent storage
const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const RECIPES_FILE = path.join(DATA_DIR, 'recipes.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load data from files
function loadUsers(): User[] {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      return JSON.parse(data).map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt)
      }));
    }
  } catch (error) {
    console.error('Error loading users:', error);
  }
  return [];
}

function loadRecipes(): UserRecipe[] {
  try {
    if (fs.existsSync(RECIPES_FILE)) {
      const data = fs.readFileSync(RECIPES_FILE, 'utf8');
      return JSON.parse(data).map((recipe: any) => ({
        ...recipe,
        createdAt: new Date(recipe.createdAt),
        updatedAt: new Date(recipe.updatedAt)
      }));
    }
  } catch (error) {
    console.error('Error loading recipes:', error);
  }
  return [];
}

// Save data to files
function saveUsers(users: User[]): void {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
  }
}

function saveRecipes(recipes: UserRecipe[]): void {
  try {
    fs.writeFileSync(RECIPES_FILE, JSON.stringify(recipes, null, 2));
  } catch (error) {
    console.error('Error saving recipes:', error);
  }
}

export class AuthService {
  // Register new user
  static async register(email: string, password: string, name: string): Promise<{ user: User; token: string }> {
    const users = loadUsers();
    
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
    saveUsers(users);

    // Generate token (in production, use JWT)
    const token = `token_${user.id}_${Date.now()}`;

    console.log(`✅ User registered: ${email} (ID: ${user.id})`);
    return { user, token };
  }

  // Login user
  static async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const users = loadUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      console.log(`❌ Login failed: User not found for email: ${email}`);
      throw new Error('Invalid credentials');
    }

    // In production, verify password hash
    console.log(`✅ User logged in: ${email} (ID: ${user.id})`);
    const token = `token_${user.id}_${Date.now()}`;

    return { user, token };
  }

  // Get user by token
  static async getUserByToken(token: string): Promise<User | null> {
    if (!token) return null;
    
    const userId = token.split('_')[1];
    if (!userId) return null;
    
    const users = loadUsers();
    const user = users.find(u => u.id === userId);
    
    if (user) {
      console.log(`✅ Token validated for user: ${user.email}`);
    } else {
      console.log(`❌ Token validation failed for user ID: ${userId}`);
    }
    
    return user || null;
  }

  // Update user profile
  static async updateProfile(userId: string, updates: Partial<User['profile']>): Promise<User> {
    const users = loadUsers();
    const user = users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.profile = { ...user.profile, ...updates };
    user.updatedAt = new Date();
    
    saveUsers(users);
    return user;
  }

  // Update subscription
  static async updateSubscription(userId: string, subscription: User['subscription']): Promise<User> {
    const users = loadUsers();
    const user = users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.subscription = subscription;
    user.updatedAt = new Date();
    
    saveUsers(users);
    return user;
  }

  // Add user recipe
  static async addUserRecipe(userId: string, recipe: Omit<UserRecipe, 'id' | 'userId' | 'views' | 'likes' | 'createdAt' | 'updatedAt'>): Promise<UserRecipe> {
    const recipes = loadRecipes();
    
    const userRecipe: UserRecipe = {
      id: `recipe_${Date.now()}`,
      userId,
      ...recipe,
      views: 0,
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    recipes.push(userRecipe);
    saveRecipes(recipes);
    
    console.log(`✅ Recipe added: ${userRecipe.title} by user ${userId}`);
    return userRecipe;
  }

  // Get user recipes
  static async getUserRecipes(userId: string): Promise<UserRecipe[]> {
    const recipes = loadRecipes();
    return recipes.filter(r => r.userId === userId);
  }

  // Get all public recipes
  static async getPublicRecipes(): Promise<UserRecipe[]> {
    const recipes = loadRecipes();
    return recipes.filter(r => r.isPublic && r.isApproved);
  }

  // Get trending recipes
  static async getTrendingRecipes(): Promise<UserRecipe[]> {
    const recipes = loadRecipes();
    return recipes
      .filter(r => r.isPublic && r.isApproved)
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  }

  // Get newly posted recipes
  static async getNewlyPostedRecipes(): Promise<UserRecipe[]> {
    const recipes = loadRecipes();
    return recipes
      .filter(r => r.isPublic && r.isApproved)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10);
  }

  // Search recipes by ingredients
  static async searchRecipesByIngredients(ingredients: string[]): Promise<UserRecipe[]> {
    const recipes = loadRecipes();
    const publicRecipes = recipes.filter(r => r.isPublic && r.isApproved);
    
    return publicRecipes.filter(recipe => {
      const recipeIngredients = recipe.ingredients.map(ing => ing.toLowerCase());
      return ingredients.some(ingredient => 
        recipeIngredients.some(recipeIng => 
          recipeIng.includes(ingredient.toLowerCase()) || 
          ingredient.toLowerCase().includes(recipeIng)
        )
      );
    });
  }

  // Admin functions
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
    }
  }

  static async deleteRecipe(recipeId: string): Promise<void> {
    const recipes = loadRecipes();
    const index = recipes.findIndex(r => r.id === recipeId);
    if (index !== -1) {
      recipes.splice(index, 1);
      saveRecipes(recipes);
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
    }
  }
}

// Middleware to check authentication
export async function requireAuth(request: NextRequest): Promise<User | null> {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    console.log('❌ No auth token found');
    return null;
  }

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
