'use client';

import { useState } from 'react';

interface AddRecipeFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddRecipeForm({ onSuccess, onCancel }: AddRecipeFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '',
    steps: '',
    cookingTime: '',
    cuisine: '',
    mealType: '',
    dietaryStyle: '',
    image: '',
    website: '',
    sourceUrl: '',
    isPublic: true
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = formData.image;

      // Upload image if a file was selected
      if (imageFile) {
        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('image', imageFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          imageUrl = uploadData.url;
        } else {
          throw new Error('Failed to upload image');
        }
        setUploading(false);
      }

      // Submit recipe
      const response = await fetch('/api/recipes/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
          ingredients: formData.ingredients.split('\n').filter(ing => ing.trim()),
          steps: formData.steps.split('\n').filter(step => step.trim()),
          cookingTime: parseInt(formData.cookingTime) || 0,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          onSuccess?.();
        } else {
          alert(data.error || 'Failed to submit recipe');
        }
      } else {
        throw new Error('Failed to submit recipe');
      }
    } catch (error) {
      console.error('Error submitting recipe:', error);
      alert('Failed to submit recipe. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-base font-semibold text-slate-700 mb-2">
            Recipe Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
            placeholder="Enter recipe title"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-base font-semibold text-slate-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
            placeholder="Describe your recipe"
            required
          />
        </div>

        <div>
          <label htmlFor="ingredients" className="block text-base font-semibold text-slate-700 mb-2">
            Ingredients * (one per line)
          </label>
          <textarea
            id="ingredients"
            value={formData.ingredients}
            onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
            rows={6}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
            placeholder="1 cup flour&#10;2 eggs&#10;1/2 cup milk"
            required
          />
        </div>

        <div>
          <label htmlFor="steps" className="block text-base font-semibold text-slate-700 mb-2">
            Instructions * (one step per line)
          </label>
          <textarea
            id="steps"
            value={formData.steps}
            onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
            rows={8}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
            placeholder="Step 1: Mix ingredients&#10;Step 2: Cook for 20 minutes"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cookingTime" className="block text-base font-semibold text-slate-700 mb-2">
              Cooking Time (minutes) *
            </label>
            <input
              type="number"
              id="cookingTime"
              value={formData.cookingTime}
              onChange={(e) => setFormData({ ...formData, cookingTime: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
              placeholder="30"
              required
            />
          </div>

          <div>
            <label htmlFor="cuisine" className="block text-base font-semibold text-slate-700 mb-2">
              Cuisine *
            </label>
            <select
              id="cuisine"
              value={formData.cuisine}
              onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
              required
            >
              <option value="">Select cuisine</option>
              <option value="American">American</option>
              <option value="Italian">Italian</option>
              <option value="Mexican">Mexican</option>
              <option value="Asian">Asian</option>
              <option value="Indian">Indian</option>
              <option value="Mediterranean">Mediterranean</option>
              <option value="French">French</option>
              <option value="Chinese">Chinese</option>
              <option value="Japanese">Japanese</option>
              <option value="Thai">Thai</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="mealType" className="block text-base font-semibold text-slate-700 mb-2">
              Meal Type *
            </label>
            <select
              id="mealType"
              value={formData.mealType}
              onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
              required
            >
              <option value="">Select meal type</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
              <option value="Dessert">Dessert</option>
              <option value="Appetizer">Appetizer</option>
              <option value="Side Dish">Side Dish</option>
            </select>
          </div>

          <div>
            <label htmlFor="dietaryStyle" className="block text-base font-semibold text-slate-700 mb-2">
              Dietary Style *
            </label>
            <select
              id="dietaryStyle"
              value={formData.dietaryStyle}
              onChange={(e) => setFormData({ ...formData, dietaryStyle: e.target.value })}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
              required
            >
              <option value="">Select dietary style</option>
              <option value="Regular">Regular</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Gluten-Free">Gluten-Free</option>
              <option value="Dairy-Free">Dairy-Free</option>
              <option value="Keto">Keto</option>
              <option value="Paleo">Paleo</option>
              <option value="Low-Carb">Low-Carb</option>
              <option value="High-Protein">High-Protein</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="image" className="block text-base font-semibold text-slate-700 mb-2">
            Recipe Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
          />
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border border-slate-300"
              />
            </div>
          )}
        </div>

        <div>
          <label htmlFor="website" className="block text-base font-semibold text-slate-700 mb-2">
            Website (optional)
          </label>
          <input
            type="url"
            id="website"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label htmlFor="sourceUrl" className="block text-base font-semibold text-slate-700 mb-2">
            Source URL (optional)
          </label>
          <input
            type="url"
            id="sourceUrl"
            value={formData.sourceUrl}
            onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
            className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-black"
            placeholder="https://example.com/recipe"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            checked={formData.isPublic}
            onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
            className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-slate-300 rounded"
          />
          <label htmlFor="isPublic" className="ml-2 text-base text-slate-700">
            Make this recipe public
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setFormData({
                title: '',
                description: '',
                ingredients: '',
                steps: '',
                cookingTime: '',
                cuisine: '',
                mealType: '',
                dietaryStyle: '',
                image: '',
                website: '',
                sourceUrl: '',
                isPublic: true
              });
              setImageFile(null);
              setImagePreview('');
            }}
            className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Clear Form
          </button>
          <button
            type="submit"
            disabled={submitting || uploading}
            className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Submitting...' : uploading ? 'Uploading...' : 'Submit Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
}
