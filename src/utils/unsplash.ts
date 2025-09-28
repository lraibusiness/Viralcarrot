import axios from 'axios';

interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  user: {
    name: string;
    username: string;
  };
  links: {
    download_location: string;
  };
}

interface UnsplashSearchResponse {
  results: UnsplashImage[];
  total: number;
  total_pages: number;
}

// Enhanced Unsplash image fetcher with food-only filtering
export class UnsplashImageFetcher {
  private accessKey: string;
  private usedImages: Set<string> = new Set();
  private sessionKey: string;

  constructor(accessKey: string, sessionKey: string) {
    this.accessKey = accessKey;
    this.sessionKey = sessionKey;
  }

  // Get high-quality recipe image with food-only filtering
  async getRecipeImage(
    title: string, 
    mainFood: string, 
    cuisine?: string, 
    mealType?: string,
    index: number = 0
  ): Promise<string> {
    try {
      // Strategy 1: Search by exact recipe title + food filter
      let image = await this.searchByTitleWithFoodFilter(title);
      if (image) return image;

      // Strategy 2: Search by main food + cuisine + food filter
      if (cuisine) {
        image = await this.searchByFoodAndCuisineWithFilter(mainFood, cuisine);
        if (image) return image;
      }

      // Strategy 3: Search by main food + meal type + food filter
      if (mealType) {
        image = await this.searchByFoodAndMealTypeWithFilter(mainFood, mealType);
        if (image) return image;
      }

      // Strategy 4: Search by main food with cooking methods + food filter
      image = await this.searchByFoodWithMethodsAndFilter(mainFood);
      if (image) return image;

      // Strategy 5: Search by main food only + food filter
      image = await this.searchByFoodWithFilter(mainFood);
      if (image) return image;

      // Fallback to curated food images
      return this.getFallbackImage(mainFood, index);

    } catch (error) {
      console.error('❌ Unsplash search error:', error);
      return this.getFallbackImage(mainFood, index);
    }
  }

  // Search by exact recipe title with food filter
  private async searchByTitleWithFoodFilter(title: string): Promise<string | null> {
    const query = this.cleanTitleForSearch(title) + ' food dish meal';
    return await this.performSearchWithFoodFilter(query, 1);
  }

  // Search by main food and cuisine with food filter
  private async searchByFoodAndCuisineWithFilter(mainFood: string, cuisine: string): Promise<string | null> {
    const query = `${mainFood} ${cuisine} food dish meal recipe`;
    return await this.performSearchWithFoodFilter(query, 1);
  }

  // Search by main food and meal type with food filter
  private async searchByFoodAndMealTypeWithFilter(mainFood: string, mealType: string): Promise<string | null> {
    const query = `${mainFood} ${mealType} food dish meal`;
    return await this.performSearchWithFoodFilter(query, 1);
  }

  // Search by main food with cooking methods and food filter
  private async searchByFoodWithMethodsAndFilter(mainFood: string): Promise<string | null> {
    const cookingMethods = ['grilled', 'roasted', 'pan-seared', 'baked', 'fried', 'steamed'];
    const method = cookingMethods[Math.floor(Math.random() * cookingMethods.length)];
    const query = `${method} ${mainFood} food dish meal`;
    return await this.performSearchWithFoodFilter(query, 1);
  }

  // Search by main food only with food filter
  private async searchByFoodWithFilter(mainFood: string): Promise<string | null> {
    const query = `${mainFood} food dish meal recipe`;
    return await this.performSearchWithFoodFilter(query, 1);
  }

  // Perform actual Unsplash search with food filtering
  private async performSearchWithFoodFilter(query: string, perPage: number = 1): Promise<string | null> {
    try {
      const response = await axios.get<UnsplashSearchResponse>('https://api.unsplash.com/search/photos', {
        params: {
          query: query,
          per_page: perPage,
          orientation: 'landscape',
          content_filter: 'high'
        },
        headers: {
          'Authorization': `Client-ID ${this.accessKey}`
        }
      });

      if (response.data.results && response.data.results.length > 0) {
        // Filter out live animal images and ensure food-only content
        const foodImages = response.data.results.filter(image => 
          this.isFoodImage(image.alt_description, query)
        );
        
        if (foodImages.length > 0) {
          const image = foodImages[0];
          
          // Check if we've already used this image
          if (!this.usedImages.has(image.id)) {
            this.usedImages.add(image.id);
            
            // Track download for analytics
            this.trackDownload(image.links.download_location);
            
            return image.urls.regular;
          }
        }
      }

      return null;
    } catch (error) {
      console.error(`❌ Unsplash search failed for query "${query}":`, error);
      return null;
    }
  }

  // Check if image is food-related (not live animals)
  private isFoodImage(altDescription: string, query: string): boolean {
    if (!altDescription) return true; // If no description, assume it's okay
    
    const alt = altDescription.toLowerCase();
    const queryLower = query.toLowerCase();
    
    // Exclude live animal images
    const liveAnimalKeywords = [
      'live chicken', 'live cow', 'live pig', 'live sheep', 'live goat',
      'farm animal', 'livestock', 'poultry', 'cattle', 'swine',
      'animal in field', 'chicken coop', 'barn', 'farm',
      'raw meat', 'butcher', 'slaughter'
    ];
    
    // Check for live animal keywords
    const hasLiveAnimal = liveAnimalKeywords.some(keyword => 
      alt.includes(keyword) || queryLower.includes(keyword)
    );
    
    if (hasLiveAnimal) return false;
    
    // Include food-related keywords
    const foodKeywords = [
      'food', 'dish', 'meal', 'recipe', 'cooked', 'prepared',
      'dinner', 'lunch', 'breakfast', 'appetizer', 'main course',
      'grilled', 'roasted', 'baked', 'fried', 'steamed', 'boiled',
      'plated', 'served', 'garnished', 'seasoned'
    ];
    
    const hasFoodKeywords = foodKeywords.some(keyword => 
      alt.includes(keyword) || queryLower.includes(keyword)
    );
    
    return hasFoodKeywords;
  }

  // Clean title for better search results
  private cleanTitleForSearch(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remove special characters
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  }

  // Track image download for analytics
  private async trackDownload(downloadUrl: string): Promise<void> {
    try {
      await axios.get(downloadUrl, {
        headers: {
          'Authorization': `Client-ID ${this.accessKey}`
        }
      });
    } catch (error) {
      // Silently fail - this is just for analytics
    }
  }

  // Get fallback image based on main food (food-only images)
  private getFallbackImage(mainFood: string, index: number): string {
    const fallbackImages = {
      chicken: [
        'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&q=80', // Cooked chicken breast
        'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80', // Grilled chicken
        'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80'  // Chicken dish
      ],
      beef: [
        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80', // Cooked beef
        'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&q=80', // Beef steak
        'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80'  // Beef dish
      ],
      salmon: [
        'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80', // Cooked salmon
        'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80', // Salmon fillet
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80'  // Salmon dish
      ],
      pasta: [
        'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&q=80', // Pasta dish
        'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80', // Spaghetti
        'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&q=80'  // Pasta bowl
      ],
      rice: [
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80', // Rice dish
        'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80', // Rice bowl
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80'  // Rice meal
      ],
      vegetables: [
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80', // Vegetable dish
        'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80', // Roasted vegetables
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80'  // Vegetable medley
      ],
      fish: [
        'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80', // Fish dish
        'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80', // Fish fillet
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80'  // Fish meal
      ],
      shrimp: [
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80', // Shrimp dish
        'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80', // Shrimp scampi
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80'  // Shrimp meal
      ],
      octopus: [
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80', // Octopus dish
        'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80', // Grilled octopus
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80'  // Octopus meal
      ]
    };
    
    const foodKey = Object.keys(fallbackImages).find(key => 
      mainFood.toLowerCase().includes(key) || key.includes(mainFood.toLowerCase())
    ) as keyof typeof fallbackImages;
    
    if (foodKey && fallbackImages[foodKey]) {
      const images = fallbackImages[foodKey];
      return images[index % images.length];
    }
    
    // Ultimate fallback - generic food image
    return 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80';
  }

  // Get multiple images for a recipe collection
  async getMultipleImages(
    titles: string[], 
    mainFood: string, 
    cuisine?: string, 
    mealType?: string
  ): Promise<string[]> {
    const images: string[] = [];
    
    for (let i = 0; i < titles.length; i++) {
      const image = await this.getRecipeImage(titles[i], mainFood, cuisine, mealType, i);
      images.push(image);
    }
    
    return images;
  }

  // Clear used images cache
  clearCache(): void {
    this.usedImages.clear();
  }
}

// Export singleton instance
let unsplashFetcher: UnsplashImageFetcher | null = null;

export function getUnsplashFetcher(sessionKey: string): UnsplashImageFetcher {
  if (!unsplashFetcher) {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      throw new Error('UNSPLASH_ACCESS_KEY is not set in environment variables');
    }
    unsplashFetcher = new UnsplashImageFetcher(accessKey, sessionKey);
  }
  return unsplashFetcher;
}
