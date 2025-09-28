'use client';

import { useState } from 'react';

interface Recipe {
  id: string;
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
  status: string;
}

interface UserRecipeEditorProps {
  recipe: Recipe;
  onSave: (updatedRecipe: Recipe) => void;
  onCancel: () => void;
}

export default function UserRecipeEditor({ recipe, onSave, onCancel }: UserRecipeEditorProps) {
  const [formData, setFormData] = useState({
    title: recipe.title,
    description: recipe.description,
    ingredients: recipe.ingredients.join('\n'),
    steps: recipe.steps.join('\n'),
    cookingTime: recipe.cookingTime,
    cuisine: recipe.cuisine,
    mealType: recipe.mealType,
    dietaryStyle: recipe.dietaryStyle,
    image: recipe.image,
    website: recipe.website || '',
    sourceUrl: recipe.sourceUrl || '',
    isPublic: recipe.isPublic
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(recipe.image);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    console.log('📤 Client: Starting image upload for file:', file.name);
    
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      console.log('📤 Client: Upload response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Client: Upload failed:', errorData);
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Client: Upload successful:', data);
      return data.imageUrl;
    } catch (error) {
      console.error('❌ Client: Upload error:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let imageUrl = formData.image;

      // Upload new image if one was selected
      if (imageFile) {
        console.log('📤 Client: Uploading image file');
        setUploading(true);
        try {
          imageUrl = await uploadImage(imageFile);
          console.log('✅ Client: Image uploaded successfully:', imageUrl);
        } catch (error) {
          console.error('❌ Client: Image upload failed:', error);
          alert(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
          return;
        } finally {
          setUploading(false);
        }
      }

      const updatedRecipe: Recipe = {
        ...recipe,
        title: formData.title,
        description: formData.description,
        ingredients: formData.ingredients.split('\n').filter(ing => ing.trim()),
        steps: formData.steps.split('\n').filter(step => step.trim()),
        cookingTime: formData.cookingTime,
        cuisine: formData.cuisine,
        mealType: formData.mealType,
        dietaryStyle: formData.dietaryStyle,
        image: imageUrl,
        website: formData.website,
        sourceUrl: formData.sourceUrl,
        isPublic: formData.isPublic
      };

      onSave(updatedRecipe);
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Failed to save recipe. Please try again.');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Edit Your Recipe</h2>
          <button
            onClick={onCancel}
            className="text-slate-500 hover:text-slate-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Recipe Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Enter recipe title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                rows={3}
                placeholder="Enter recipe description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ingredients (one per line)
              </label>
              <textarea
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                rows={6}
                placeholder="Enter ingredients, one per line"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Instructions (one per line)
              </label>
              <textarea
                value={formData.steps}
                onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                rows={8}
                placeholder="Enter cooking instructions, one per line"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Recipe Image
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Recipe preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Or enter image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cooking Time (minutes)
                </label>
                <input
                  type="number"
                  value={formData.cookingTime}
                  onChange={(e) => setFormData({ ...formData, cookingTime: parseInt(e.target.value) || 0 })}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Visibility
                </label>
                <select
                  value={formData.isPublic ? 'public' : 'private'}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.value === 'public' })}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Cuisine
                </label>
                <select
                  value={formData.cuisine}
                  onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Select Cuisine</option>
                  <option value="Italian">Italian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Asian">Asian</option>
                  <option value="Mediterranean">Mediterranean</option>
                  <option value="Indian">Indian</option>
                  <option value="American">American</option>
                  <option value="French">French</option>
                  <option value="Thai">Thai</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Meal Type
                </label>
                <select
                  value={formData.mealType}
                  onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Select Type</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack">Snack</option>
                  <option value="Dessert">Dessert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Dietary Style
                </label>
                <select
                  value={formData.dietaryStyle}
                  onChange={(e) => setFormData({ ...formData, dietaryStyle: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Select Diet</option>
                  <option value="Regular">Regular</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Keto">Keto</option>
                  <option value="Gluten-Free">Gluten-Free</option>
                  <option value="Low-Carb">Low-Carb</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Website (optional)
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Source URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.sourceUrl}
                  onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="https://source.com/recipe"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-slate-200">
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
