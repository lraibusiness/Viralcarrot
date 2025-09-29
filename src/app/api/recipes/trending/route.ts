import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Trending API: Fetching latest community recipes');
    
    // Try to fetch user-submitted recipes first
    let userRecipes = [];
    try {
      const recipesPath = path.join(process.cwd(), 'data', 'recipes.json');
      if (fs.existsSync(recipesPath)) {
        const recipesData = JSON.parse(fs.readFileSync(recipesPath, 'utf8'));
        // Filter for approved recipes - check both status and isApproved fields
        userRecipes = recipesData.filter(recipe => 
          recipe.status === 'approved' || recipe.isApproved === true
        );
        console.log(`📋 Found ${userRecipes.length} approved user recipes`);
      }
    } catch (error) {
      console.log('⚠️ Could not load user recipes, using fallback');
    }
    
    // Create 5 complete community recipes as fallback
    const communityRecipes = [
      {
        id: 'community-1',
        title: 'Creamy Garlic Butter Chicken',
        image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&q=80',
        description: 'Tender chicken breast cooked in a rich garlic butter sauce with herbs. Perfect for a cozy dinner.',
        ingredients: [
          '4 boneless chicken breasts',
          '4 cloves garlic, minced',
          '4 tbsp butter',
          '2 tbsp olive oil',
          '1/2 cup heavy cream',
          '1/4 cup chicken broth',
          '2 tbsp fresh parsley, chopped',
          '1 tsp dried thyme',
          'Salt and black pepper to taste',
          '1/4 cup grated parmesan cheese'
        ],
        steps: [
          'Season chicken breasts with salt and pepper on both sides.',
          'Heat olive oil in a large skillet over medium-high heat.',
          'Add chicken and cook for 5-6 minutes per side until golden and cooked through.',
          'Remove chicken and set aside on a plate.',
          'In the same skillet, add butter and minced garlic. Cook for 1 minute until fragrant.',
          'Add heavy cream, chicken broth, and thyme. Bring to a simmer.',
          'Return chicken to the skillet and spoon sauce over the top.',
          'Sprinkle with parmesan cheese and fresh parsley.',
          'Serve immediately with your favorite sides.'
        ],
        cookingTime: 25,
        cuisine: 'Italian',
        mealType: 'Dinner',
        dietaryStyle: 'Regular',
        tags: ['Italian', 'Dinner', 'Chicken', 'Creamy'],
        createdBy: 'ViralCarrot Community',
        matchScore: 95,
        views: 1247,
        likes: 89,
        createdAt: new Date().toISOString(),
        website: 'ViralCarrot Community',
        sourceUrl: '#'
      },
      {
        id: 'community-2',
        title: 'Chocolate Lava Cake',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
        description: 'Decadent individual chocolate cakes with a molten chocolate center. Perfect for special occasions.',
        ingredients: [
          '1/2 cup dark chocolate chips',
          '1/4 cup butter',
          '1/4 cup all-purpose flour',
          '1/2 cup powdered sugar',
          '2 large eggs',
          '2 egg yolks',
          '1 tsp vanilla extract',
          'Pinch of salt',
          'Butter for greasing',
          'Cocoa powder for dusting'
        ],
        steps: [
          'Preheat oven to 425°F (220°C).',
          'Grease 4 ramekins with butter and dust with cocoa powder.',
          'Melt chocolate and butter in a double boiler, stirring until smooth.',
          'In a separate bowl, whisk together flour, powdered sugar, and salt.',
          'In another bowl, whisk eggs, egg yolks, and vanilla until well combined.',
          'Slowly whisk the melted chocolate mixture into the egg mixture.',
          'Fold in the flour mixture until just combined.',
          'Divide batter evenly among prepared ramekins.',
          'Bake for 12-14 minutes until edges are firm but centers are still soft.',
          'Let cool for 1 minute, then invert onto serving plates.',
          'Serve immediately with ice cream or whipped cream.'
        ],
        cookingTime: 20,
        cuisine: 'French',
        mealType: 'Dessert',
        dietaryStyle: 'Regular',
        tags: ['French', 'Dessert', 'Chocolate', 'Baking'],
        createdBy: 'ViralCarrot Community',
        matchScore: 92,
        views: 2156,
        likes: 156,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        website: 'ViralCarrot Community',
        sourceUrl: '#'
      },
      {
        id: 'community-3',
        title: 'Mediterranean Quinoa Bowl',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
        description: 'Nutritious quinoa bowl loaded with fresh vegetables, olives, and feta cheese. A healthy and satisfying meal.',
        ingredients: [
          '1 cup quinoa',
          '2 cups vegetable broth',
          '1 cucumber, diced',
          '2 tomatoes, diced',
          '1/2 red onion, thinly sliced',
          '1/2 cup kalamata olives, pitted',
          '1/2 cup feta cheese, crumbled',
          '1/4 cup fresh parsley, chopped',
          '2 tbsp olive oil',
          '2 tbsp lemon juice',
          '1 tsp dried oregano',
          'Salt and pepper to taste'
        ],
        steps: [
          'Rinse quinoa under cold water until water runs clear.',
          'In a medium saucepan, bring vegetable broth to a boil.',
          'Add quinoa, reduce heat to low, cover and simmer for 15 minutes.',
          'Remove from heat and let stand covered for 5 minutes.',
          'Fluff quinoa with a fork and let cool to room temperature.',
          'In a large bowl, combine cooled quinoa with cucumber, tomatoes, and red onion.',
          'Add olives, feta cheese, and fresh parsley.',
          'In a small bowl, whisk together olive oil, lemon juice, and oregano.',
          'Pour dressing over the quinoa mixture and toss gently.',
          'Season with salt and pepper to taste.',
          'Serve at room temperature or chilled.'
        ],
        cookingTime: 30,
        cuisine: 'Mediterranean',
        mealType: 'Lunch',
        dietaryStyle: 'Vegetarian',
        tags: ['Mediterranean', 'Lunch', 'Quinoa', 'Healthy'],
        createdBy: 'ViralCarrot Community',
        matchScore: 88,
        views: 1893,
        likes: 134,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        website: 'ViralCarrot Community',
        sourceUrl: '#'
      },
      {
        id: 'community-4',
        title: 'Spicy Thai Basil Beef',
        image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&q=80',
        description: 'Authentic Thai stir-fry with ground beef, fresh basil, and aromatic spices. Quick and flavorful!',
        ingredients: [
          '1 lb ground beef',
          '4 cloves garlic, minced',
          '2 Thai chilies, sliced',
          '1 red bell pepper, sliced',
          '1/2 cup fresh Thai basil leaves',
          '3 tbsp fish sauce',
          '2 tbsp soy sauce',
          '1 tbsp oyster sauce',
          '1 tbsp brown sugar',
          '2 tbsp vegetable oil',
          '1/4 cup chicken broth',
          '2 eggs (optional)',
          'Jasmine rice for serving'
        ],
        steps: [
          'Heat vegetable oil in a large wok or skillet over high heat.',
          'Add garlic and Thai chilies, stir-fry for 30 seconds until fragrant.',
          'Add ground beef and cook, breaking it up, until browned and cooked through.',
          'Add bell pepper and stir-fry for 2 minutes until slightly softened.',
          'In a small bowl, mix fish sauce, soy sauce, oyster sauce, and brown sugar.',
          'Pour sauce mixture over the beef and stir to combine.',
          'Add chicken broth and bring to a simmer.',
          'If using eggs, push beef to one side and crack eggs into the pan.',
          'Scramble eggs until set, then mix with beef.',
          'Remove from heat and stir in fresh basil leaves.',
          'Serve immediately over jasmine rice.'
        ],
        cookingTime: 15,
        cuisine: 'Asian',
        mealType: 'Dinner',
        dietaryStyle: 'Regular',
        tags: ['Asian', 'Dinner', 'Beef', 'Spicy'],
        createdBy: 'ViralCarrot Community',
        matchScore: 90,
        views: 1674,
        likes: 98,
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        website: 'ViralCarrot Community',
        sourceUrl: '#'
      },
      {
        id: 'community-5',
        title: 'Classic New York Cheesecake',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
        description: 'Creamy and rich New York-style cheesecake with a graham cracker crust. The perfect dessert for any occasion.',
        ingredients: [
          '2 cups graham cracker crumbs',
          '1/2 cup butter, melted',
          '1/4 cup sugar',
          '4 (8 oz) packages cream cheese, softened',
          '1 1/4 cups sugar',
          '4 large eggs',
          '1/3 cup sour cream',
          '1/3 cup heavy cream',
          '2 tsp vanilla extract',
          '1/4 tsp salt',
          'Fresh berries for garnish'
        ],
        steps: [
          'Preheat oven to 350°F (175°C).',
          'Mix graham cracker crumbs, melted butter, and 1/4 cup sugar.',
          'Press mixture into the bottom of a 9-inch springform pan.',
          'Bake crust for 10 minutes, then cool completely.',
          'In a large bowl, beat cream cheese until smooth.',
          'Gradually add 1 1/4 cups sugar, beating until combined.',
          'Add eggs one at a time, beating well after each addition.',
          'Mix in sour cream, heavy cream, vanilla, and salt.',
          'Pour filling over cooled crust.',
          'Bake for 50-60 minutes until center is almost set.',
          'Turn off oven and let cheesecake cool in oven for 1 hour.',
          'Remove from oven and cool completely on wire rack.',
          'Refrigerate for at least 4 hours before serving.',
          'Garnish with fresh berries before serving.'
        ],
        cookingTime: 90,
        cuisine: 'American',
        mealType: 'Dessert',
        dietaryStyle: 'Regular',
        tags: ['American', 'Dessert', 'Cheesecake', 'Baking'],
        createdBy: 'ViralCarrot Community',
        matchScore: 94,
        views: 3421,
        likes: 267,
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        website: 'ViralCarrot Community',
        sourceUrl: '#'
      }
    ];
    
    // Sort user recipes by creation date (newest first)
    const sortedUserRecipes = userRecipes
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Sort community recipes by creation date (newest first)
    const sortedCommunityRecipes = communityRecipes
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Combine with user recipes first, then community recipes
    const allRecipes = [...sortedUserRecipes, ...sortedCommunityRecipes];
    
    // Take the first 6 recipes (prioritizing user recipes)
    const finalRecipes = allRecipes.slice(0, 6);
    
    console.log(`✅ Trending API: Returning ${finalRecipes.length} recipes (${sortedUserRecipes.length} user + ${sortedCommunityRecipes.length} community)`);
    
    return NextResponse.json({
      success: true,
      recipes: finalRecipes,
      total: finalRecipes.length
    });
    
  } catch (error) {
    console.error('❌ Trending API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trending recipes' },
      { status: 500 }
    );
  }
}
