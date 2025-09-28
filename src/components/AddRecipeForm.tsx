'use client';

import { useState } from 'react';

interface AddRecipeFormProps {
  onSubmit: (recipe: any) => void;
  onCancel?: () => void;
}

export default function AddRecipeForm({ onSubmit, onCancel }: AddRecipeFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '',
    steps: '',
    cookingTime: 30,
    cuisine: '',
    mealType: '',
    dietaryStyle: '',
    image: '',
    website: '',
    sourceUrl: '',
    isPublic: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const recipeData = {
        ...formData,
        ingredients: formData.ingredients.split(',').map(ing => ing.trim()).filter(Boolean),
        steps: formData.steps.split('\n').filter(step => step.trim()),
        cookingTime: parseInt(formData.cookingTime.toString())
      };

      await onSubmit(recipeData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        ingredients: '',
        steps: '',
        cookingTime: 30,
        cuisine: '',
        mealType: '',
        dietaryStyle: '',
        image: '',
        website: '',
        sourceUrl: '',
        isPublic: true
      });
    } catch (error) {
      console.error('Error submitting recipe:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Share Your Recipe</h2>
        <p className="text-gray-600">Create a recipe pin that other users can discover when searching for similar ingredients!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Recipe Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="e.g., Grandma's Famous Chocolate Chip Cookies"
            />
          </div>

          <div>
            <label htmlFor="cookingTime" className="block text-sm font-medium text-gray-700 mb-2">
              Cooking Time (minutes) *
            </label>
            <input
              type="number"
              id="cookingTime"
              name="cookingTime"
              value={formData.cookingTime}
              onChange={handleChange}
              required
              min="5"
              max="300"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Describe your recipe - what makes it special?"
          />
        </div>

        {/* Ingredients */}
        <div>
          <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-2">
            Ingredients * (comma-separated)
          </label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="2 cups flour, 1 cup sugar, 3 eggs, 1/2 cup butter..."
          />
        </div>

        {/* Instructions */}
        <div>
          <label htmlFor="steps" className="block text-sm font-medium text-gray-700 mb-2">
            Instructions * (one step per line)
          </label>
          <textarea
            id="steps"
            name="steps"
            value={formData.steps}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="1. Preheat oven to 350°F&#10;2. Mix dry ingredients&#10;3. Add wet ingredients&#10;4. Bake for 12-15 minutes..."
          />
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-2">
              Cuisine
            </label>
            <select
              id="cuisine"
              name="cuisine"
              value={formData.cuisine}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Select Cuisine</option>
              <option value="italian">Italian</option>
              <option value="asian">Asian</option>
              <option value="mexican">Mexican</option>
              <option value="mediterranean">Mediterranean</option>
              <option value="indian">Indian</option>
              <option value="american">American</option>
              <option value="french">French</option>
              <option value="thai">Thai</option>
              <option value="chinese">Chinese</option>
              <option value="japanese">Japanese</option>
            </select>
          </div>

          <div>
            <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 mb-2">
              Meal Type
            </label>
            <select
              id="mealType"
              name="mealType"
              value={formData.mealType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Select Meal Type</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
              <option value="dessert">Dessert</option>
              <option value="appetizer">Appetizer</option>
              <option value="side">Side Dish</option>
            </select>
          </div>

          <div>
            <label htmlFor="dietaryStyle" className="block text-sm font-medium text-gray-700 mb-2">
              Dietary Style
            </label>
            <select
              id="dietaryStyle"
              name="dietaryStyle"
              value={formData.dietaryStyle}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Select Dietary Style</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="gluten-free">Gluten-Free</option>
              <option value="dairy-free">Dairy-Free</option>
              <option value="keto">Keto</option>
              <option value="paleo">Paleo</option>
              <option value="low-carb">Low-Carb</option>
              <option value="high-protein">High-Protein</option>
            </select>
          </div>
        </div>

        {/* Image and Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="https://example.com/recipe-image.jpg"
            />
          </div>

          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
              Your Website/Blog
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="https://yourblog.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="sourceUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Source URL (if adapted from another recipe)
          </label>
          <input
            type="url"
            id="sourceUrl"
            name="sourceUrl"
            value={formData.sourceUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="https://original-recipe-source.com"
          />
        </div>

        {/* Public/Private Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            name="isPublic"
            checked={formData.isPublic}
            onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
            className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
          />
          <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
            Make this recipe public (other users can discover it when searching)
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating Recipe...' : 'Create Recipe Pin'}
          </button>
        </div>
      </form>
    </div>
  );
}
