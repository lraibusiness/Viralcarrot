# 🖼️ Unsplash Account Setup Guide for ViralCarrot

## Step 1: Get Your Unsplash API Key

1. **Go to Unsplash Developers**: https://unsplash.com/developers
2. **Sign in** with your Unsplash account (or create one if you don't have it)
3. **Click "New Application"**
4. **Fill out the application form**:
   - **Application Name**: "ViralCarrot Recipe App"
   - **Description**: "Recipe generation app that fetches food images for cooking recipes"
   - **Website URL**: "https://viralcarrot.com" (or your domain)
5. **Accept the API Terms** and click "Create Application"
6. **Copy your Access Key** (it will look like: `abc123def456...`)

## Step 2: Add Your API Key to the Project

1. **Open the `.env.local` file** in your project root
2. **Replace `your_unsplash_access_key_here`** with your actual Unsplash Access Key
3. **Save the file**

Example:
```bash
# Unsplash API Configuration
UNSPLASH_ACCESS_KEY=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz

# Next.js Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Step 3: Deploy to Vercel with Environment Variables

1. **Go to your Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your ViralCarrot project**
3. **Go to Settings → Environment Variables**
4. **Add a new environment variable**:
   - **Name**: `UNSPLASH_ACCESS_KEY`
   - **Value**: Your Unsplash Access Key
   - **Environment**: Production, Preview, Development
5. **Click "Save"**
6. **Redeploy your project**

## Step 4: Test the Integration

1. **Start your development server**: `npm run dev`
2. **Open your app**: http://localhost:3000
3. **Generate some recipes** with different main ingredients
4. **Check the console logs** for Unsplash API calls
5. **Verify that images are loading** and are relevant to the recipes

## 🎯 What You'll Get

### Enhanced Image Quality
- **High-resolution images** from Unsplash's professional photographers
- **Relevant food photography** that matches your recipe titles
- **Unique images** for each recipe (no duplicates)
- **Proper attribution** to photographers

### Smart Image Search
- **Multiple search strategies** for better results
- **Cuisine-specific images** (Italian, Asian, Mexican, etc.)
- **Cooking method-based images** (grilled, roasted, pan-seared, etc.)
- **Fallback system** if Unsplash is unavailable

### Professional Results
- **Restaurant-quality photos** for your recipes
- **Consistent image quality** across all recipes
- **Better user engagement** with appealing visuals
- **Professional appearance** for your app

## 🔧 Technical Details

### API Rate Limits
- **50 requests per hour** for demo applications
- **5,000 requests per hour** for production applications
- **Automatic rate limiting** built into the system

### Image Caching
- **Session-based caching** to avoid duplicate requests
- **Fallback images** for offline scenarios
- **Optimized loading** with proper image sizing

### Search Strategies
1. **Exact recipe title search**
2. **Main food + cuisine search**
3. **Main food + meal type search**
4. **Main food + cooking method search**
5. **Main food only search**
6. **Curated fallback images**

## 🚀 Benefits

- **Better User Experience**: High-quality, relevant images
- **Professional Appearance**: Restaurant-quality photography
- **Unique Content**: No duplicate images across recipes
- **SEO Benefits**: Proper image optimization
- **Brand Consistency**: Professional visual identity

## 📊 Monitoring

Check your Unsplash Developer Dashboard to monitor:
- **API usage statistics**
- **Download tracking**
- **Rate limit status**
- **Application performance**

## 🆘 Troubleshooting

### Common Issues:
1. **"UNSPLASH_ACCESS_KEY is not set"**: Make sure your API key is in `.env.local`
2. **Images not loading**: Check your API key and rate limits
3. **Fallback images showing**: Unsplash API might be rate-limited
4. **Duplicate images**: Clear your browser cache and restart the server

### Support:
- **Unsplash API Docs**: https://unsplash.com/documentation
- **ViralCarrot Support**: Check the console logs for detailed error messages
- **Rate Limit Info**: Check your Unsplash Developer Dashboard

## 🎉 Success!

Once set up, your ViralCarrot app will automatically:
- ✅ Fetch high-quality images from Unsplash
- ✅ Match images to recipe titles and ingredients
- ✅ Provide unique, professional photos for each recipe
- ✅ Fall back gracefully if Unsplash is unavailable
- ✅ Track downloads for proper attribution

Your recipes will now look professional and appetizing with real, high-quality food photography!
