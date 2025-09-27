import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ingredients, filters } = body;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Extended recipe database with 10 recipes
    const allRecipes = [
      {
        id: '1',
        title: 'Creamy Garlic Chicken Pasta',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop',
        description: 'A rich and creamy pasta dish with tender chicken and aromatic garlic, perfect for a cozy dinner.',
        ingredients: ['2 chicken breasts, diced', '8 oz pasta', '4 cloves garlic, minced', '1 cup heavy cream', '1/2 cup parmesan cheese', '2 tbsp butter', 'Salt and pepper to taste', 'Fresh parsley for garnish'],
        steps: ['Cook pasta according to package directions until al dente.', 'Season chicken with salt and pepper, then cook in a large pan until golden brown.', 'Add minced garlic and cook for 1 minute until fragrant.', 'Pour in heavy cream and bring to a gentle simmer.', 'Add cooked pasta and parmesan cheese, tossing until well combined.', 'Garnish with fresh parsley and serve immediately.'],
        cookingTime: 25,
        cuisine: 'italian',
        mealType: 'dinner',
        dietaryStyle: 'none'
      },
      {
        id: '2',
        title: 'Mediterranean Quinoa Bowl',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop',
        description: 'A healthy and colorful bowl packed with Mediterranean flavors and nutritious quinoa.',
        ingredients: ['1 cup quinoa', '1 cucumber, diced', '2 tomatoes, chopped', '1/2 red onion, sliced', '1/2 cup kalamata olives', '4 oz feta cheese, crumbled', '2 tbsp olive oil', '1 tbsp lemon juice', 'Fresh herbs (oregano, basil)', 'Salt and pepper to taste'],
        steps: ['Cook quinoa according to package directions and let cool.', 'Prepare all vegetables and cut into bite-sized pieces.', 'In a large bowl, combine cooled quinoa with vegetables.', 'Add olives and crumbled feta cheese.', 'Drizzle with olive oil and lemon juice.', 'Season with salt, pepper, and fresh herbs. Toss gently and serve.'],
        cookingTime: 20,
        cuisine: 'mediterranean',
        mealType: 'lunch',
        dietaryStyle: 'vegetarian'
      },
      {
        id: '3',
        title: 'Spicy Thai Basil Stir-Fry',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=300&fit=crop',
        description: 'A vibrant and spicy stir-fry with fresh basil, perfect for those who love bold Asian flavors.',
        ingredients: ['1 lb ground chicken or pork', '2 cups fresh basil leaves', '4 cloves garlic, minced', '2 red chilies, sliced', '1 bell pepper, sliced', '2 tbsp fish sauce', '1 tbsp soy sauce', '1 tbsp oyster sauce', '1 tsp sugar', '2 tbsp vegetable oil', 'Jasmine rice for serving'],
        steps: ['Heat oil in a large wok or pan over high heat.', 'Add garlic and chilies, stir-fry for 30 seconds until fragrant.', 'Add ground meat and cook until browned, breaking it up with a spoon.', 'Add bell pepper and stir-fry for 2 minutes.', 'Mix fish sauce, soy sauce, oyster sauce, and sugar in a small bowl.', 'Pour sauce over the meat mixture and stir-fry for 1 minute.', 'Add basil leaves and stir-fry for 30 seconds until wilted.', 'Serve immediately over jasmine rice.'],
        cookingTime: 15,
        cuisine: 'asian',
        mealType: 'dinner',
        dietaryStyle: 'none'
      },
      {
        id: '4',
        title: 'Roasted Vegetable Frittata',
        image: 'https://images.unsplash.com/photo-1572441713132-51c75654db73?w=500&h=300&fit=crop',
        description: 'A hearty and nutritious frittata loaded with roasted vegetables and herbs.',
        ingredients: ['8 large eggs', '2 cups mixed vegetables (zucchini, bell peppers, onions)', '1/2 cup milk', '1/2 cup cheese (cheddar or feta)', '2 tbsp olive oil', '2 cloves garlic, minced', 'Fresh herbs (thyme, rosemary)', 'Salt and pepper to taste'],
        steps: ['Preheat oven to 400°F (200°C).', 'Cut vegetables into bite-sized pieces and toss with olive oil, salt, and pepper.', 'Roast vegetables for 20-25 minutes until tender.', 'Whisk eggs with milk, cheese, garlic, and herbs in a large bowl.', 'Heat an oven-safe skillet and add roasted vegetables.', 'Pour egg mixture over vegetables and cook on stovetop for 3-4 minutes.', 'Transfer to oven and bake for 15-20 minutes until set.', 'Let cool slightly before slicing and serving.'],
        cookingTime: 45,
        cuisine: 'american',
        mealType: 'breakfast',
        dietaryStyle: 'vegetarian'
      },
      {
        id: '5',
        title: 'Creamy Mushroom Risotto',
        image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500&h=300&fit=crop',
        description: 'A luxurious and creamy risotto with earthy mushrooms and parmesan cheese.',
        ingredients: ['1 1/2 cups arborio rice', '8 oz mixed mushrooms, sliced', '1 onion, finely diced', '4 cups warm chicken or vegetable broth', '1/2 cup white wine', '1/2 cup parmesan cheese, grated', '3 tbsp butter', '2 tbsp olive oil', '2 cloves garlic, minced', 'Fresh thyme', 'Salt and pepper to taste'],
        steps: ['Heat broth in a saucepan and keep warm.', 'In a large pan, sauté mushrooms until golden brown, then set aside.', 'Add onion and garlic to the same pan, cook until softened.', 'Add rice and stir for 2 minutes until lightly toasted.', 'Add wine and stir until absorbed.', 'Add warm broth one ladle at a time, stirring constantly.', 'Continue adding broth and stirring for 18-20 minutes.', 'Stir in mushrooms, butter, and parmesan cheese.', 'Season with salt, pepper, and fresh thyme. Serve immediately.'],
        cookingTime: 35,
        cuisine: 'italian',
        mealType: 'dinner',
        dietaryStyle: 'vegetarian'
      },
      {
        id: '6',
        title: 'Honey Glazed Salmon',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=300&fit=crop',
        description: 'Perfectly cooked salmon with a sweet and tangy honey glaze, served with roasted vegetables.',
        ingredients: ['4 salmon fillets (6 oz each)', '1/4 cup honey', '2 tbsp soy sauce', '2 tbsp lemon juice', '2 cloves garlic, minced', '1 tsp ginger, grated', '2 tbsp olive oil', 'Salt and pepper to taste', 'Fresh dill for garnish'],
        steps: ['Preheat oven to 400°F (200°C).', 'Mix honey, soy sauce, lemon juice, garlic, and ginger in a bowl.', 'Season salmon with salt and pepper.', 'Heat oil in an oven-safe skillet over medium-high heat.', 'Sear salmon for 2-3 minutes on each side.', 'Brush with honey glaze and transfer to oven.', 'Bake for 8-10 minutes until fish flakes easily.', 'Garnish with fresh dill and serve immediately.'],
        cookingTime: 20,
        cuisine: 'american',
        mealType: 'dinner',
        dietaryStyle: 'none'
      },
      {
        id: '7',
        title: 'Vegetarian Buddha Bowl',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&h=300&fit=crop',
        description: 'A nutritious and colorful bowl packed with roasted vegetables, grains, and a tahini dressing.',
        ingredients: ['1 cup brown rice or quinoa', '2 sweet potatoes, cubed', '1 head broccoli, cut into florets', '1 can chickpeas, drained', '1 avocado, sliced', '1/4 cup pumpkin seeds', '2 tbsp tahini', '1 tbsp lemon juice', '1 tbsp olive oil', 'Salt and pepper to taste'],
        steps: ['Cook rice or quinoa according to package directions.', 'Preheat oven to 425°F (220°C).', 'Toss sweet potatoes and broccoli with olive oil, salt, and pepper.', 'Roast vegetables for 25-30 minutes until tender.', 'Roast chickpeas for 15-20 minutes until crispy.', 'Make tahini dressing by mixing tahini, lemon juice, and water.', 'Assemble bowls with rice, roasted vegetables, chickpeas, and avocado.', 'Drizzle with tahini dressing and top with pumpkin seeds.'],
        cookingTime: 40,
        cuisine: 'american',
        mealType: 'lunch',
        dietaryStyle: 'vegan'
      },
      {
        id: '8',
        title: 'Classic Beef Stir-Fry',
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=300&fit=crop',
        description: 'A quick and flavorful stir-fry with tender beef and crisp vegetables in a savory sauce.',
        ingredients: ['1 lb beef sirloin, sliced thin', '2 bell peppers, sliced', '1 onion, sliced', '2 cups broccoli florets', '3 cloves garlic, minced', '1 tbsp ginger, grated', '3 tbsp soy sauce', '2 tbsp oyster sauce', '1 tbsp cornstarch', '2 tbsp vegetable oil', 'Sesame seeds for garnish'],
        steps: ['Mix soy sauce, oyster sauce, and cornstarch in a small bowl.', 'Heat oil in a large wok or pan over high heat.', 'Add beef and stir-fry for 2-3 minutes until browned.', 'Add garlic and ginger, stir-fry for 30 seconds.', 'Add vegetables and stir-fry for 3-4 minutes until crisp-tender.', 'Pour sauce over everything and stir-fry for 1 minute.', 'Garnish with sesame seeds and serve over rice.'],
        cookingTime: 15,
        cuisine: 'asian',
        mealType: 'dinner',
        dietaryStyle: 'none'
      },
      {
        id: '9',
        title: 'Creamy Tomato Basil Soup',
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=300&fit=crop',
        description: 'A comforting and creamy tomato soup with fresh basil, perfect for any season.',
        ingredients: ['2 lbs tomatoes, chopped', '1 onion, diced', '4 cloves garlic, minced', '2 cups vegetable broth', '1/2 cup heavy cream', '1/4 cup fresh basil, chopped', '2 tbsp olive oil', '1 tsp sugar', 'Salt and pepper to taste', 'Parmesan cheese for serving'],
        steps: ['Heat olive oil in a large pot over medium heat.', 'Add onion and garlic, cook until softened.', 'Add tomatoes and cook for 10 minutes until broken down.', 'Add broth and bring to a boil, then simmer for 20 minutes.', 'Use an immersion blender to puree the soup.', 'Stir in cream, basil, sugar, salt, and pepper.', 'Simmer for 5 more minutes.', 'Serve hot with grated parmesan cheese.'],
        cookingTime: 45,
        cuisine: 'italian',
        mealType: 'lunch',
        dietaryStyle: 'vegetarian'
      },
      {
        id: '10',
        title: 'Lemon Herb Roasted Chicken',
        image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=300&fit=crop',
        description: 'A juicy and flavorful roasted chicken with lemon and fresh herbs.',
        ingredients: ['1 whole chicken (3-4 lbs)', '2 lemons, halved', '4 cloves garlic, minced', '2 tbsp fresh rosemary, chopped', '2 tbsp fresh thyme, chopped', '1/4 cup olive oil', 'Salt and pepper to taste', '1 onion, quartered', '2 carrots, chopped', '2 potatoes, chopped'],
        steps: ['Preheat oven to 425°F (220°C).', 'Mix garlic, herbs, olive oil, salt, and pepper in a bowl.', 'Rub herb mixture all over the chicken.', 'Stuff chicken cavity with lemon halves and onion.', 'Place chicken on a roasting pan with vegetables.', 'Roast for 1 hour 15 minutes until golden and cooked through.', 'Let rest for 10 minutes before carving.', 'Serve with roasted vegetables.'],
        cookingTime: 90,
        cuisine: 'american',
        mealType: 'dinner',
        dietaryStyle: 'none'
      }
    ];

    // Filter recipes based on criteria
    let filteredRecipes = [...allRecipes];

    // Apply cooking time filter
    if (filters.cookingTime) {
      const maxTime = parseInt(filters.cookingTime);
      filteredRecipes = filteredRecipes.filter(recipe => recipe.cookingTime <= maxTime);
    }

    // Apply cuisine filter
    if (filters.cuisine) {
      filteredRecipes = filteredRecipes.filter(recipe => recipe.cuisine === filters.cuisine);
    }

    // Apply meal type filter
    if (filters.mealType) {
      filteredRecipes = filteredRecipes.filter(recipe => recipe.mealType === filters.mealType);
    }

    // Apply dietary style filter
    if (filters.dietaryStyle) {
      filteredRecipes = filteredRecipes.filter(recipe => recipe.dietaryStyle === filters.dietaryStyle);
    }

    // If no filters match, return all recipes
    if (filteredRecipes.length === 0) {
      filteredRecipes = allRecipes;
    }

    // Shuffle and return up to 10 recipes
    const shuffled = filteredRecipes.sort(() => 0.5 - Math.random());
    const selectedRecipes = shuffled.slice(0, 10);

    return NextResponse.json({
      success: true,
      recipes: selectedRecipes,
      total: selectedRecipes.length
    });

  } catch (error) {
    console.error('Error generating recipes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate recipes' },
      { status: 500 }
    );
  }
}
