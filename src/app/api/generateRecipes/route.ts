import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('API: Starting recipe generation');
    
    const body = await request.json();
    const { mainFood, ingredients, filters } = body;

    console.log('API: Received request:', { mainFood, ingredients, filters });

    if (!mainFood || !mainFood.trim()) {
      console.log('API: No main food provided');
      return NextResponse.json(
        { success: false, error: 'Please enter a main food item' },
        { status: 400 }
      );
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Recipe database with flexible matching
    const allRecipes = [
      {
        id: '1',
        title: 'Creamy Garlic Chicken Pasta',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop',
        description: 'A rich and creamy pasta dish with tender chicken and aromatic garlic.',
        ingredients: ['2 chicken breasts, diced', '8 oz pasta', '4 cloves garlic, minced', '1 cup heavy cream', '1/2 cup parmesan cheese', '2 tbsp butter', 'Salt and pepper to taste'],
        steps: ['Cook pasta according to package directions.', 'Season chicken and cook until golden brown.', 'Add garlic and cook for 1 minute.', 'Pour in heavy cream and bring to a simmer.', 'Add pasta and cheese, toss to combine.', 'Garnish with parsley and serve.'],
        cookingTime: 25,
        cuisine: 'italian',
        mealType: 'dinner',
        dietaryStyle: 'none',
        mainFoods: ['chicken', 'poultry'],
        matchingIngredients: ['pasta', 'garlic', 'cream', 'cheese', 'butter', 'onions', 'herbs']
      },
      {
        id: '2',
        title: 'Lemon Herb Roasted Chicken',
        image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=300&fit=crop',
        description: 'A juicy and flavorful roasted chicken with lemon and fresh herbs.',
        ingredients: ['1 whole chicken (3-4 lbs)', '2 lemons, halved', '4 cloves garlic, minced', '2 tbsp fresh rosemary, chopped', '2 tbsp fresh thyme, chopped', '1/4 cup olive oil', 'Salt and pepper to taste', '1 onion, quartered', '2 carrots, chopped', '2 potatoes, chopped'],
        steps: ['Preheat oven to 425°F.', 'Mix garlic, herbs, olive oil, salt, and pepper in a bowl.', 'Rub herb mixture all over the chicken.', 'Stuff chicken cavity with lemon halves and onion.', 'Place chicken on a roasting pan with vegetables.', 'Roast for 1 hour 15 minutes until golden and cooked through.', 'Let rest for 10 minutes before carving.', 'Serve with roasted vegetables.'],
        cookingTime: 90,
        cuisine: 'american',
        mealType: 'dinner',
        dietaryStyle: 'none',
        mainFoods: ['chicken', 'poultry'],
        matchingIngredients: ['lemons', 'garlic', 'rosemary', 'thyme', 'olive oil', 'onion', 'carrots', 'potatoes', 'herbs']
      },
      {
        id: '3',
        title: 'Garlic Butter Prawns',
        image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&h=300&fit=crop',
        description: 'Succulent prawns cooked in a rich garlic butter sauce.',
        ingredients: ['1 lb large prawns, peeled and deveined', '4 cloves garlic, minced', '4 tbsp butter', '2 tbsp olive oil', '1/4 cup white wine', '2 tbsp lemon juice', '1 tbsp fresh parsley, chopped', 'Salt and pepper to taste'],
        steps: ['Heat butter and olive oil in a large skillet.', 'Add garlic and cook for 30 seconds.', 'Add prawns and cook for 2-3 minutes per side.', 'Add wine and lemon juice, simmer for 2 minutes.', 'Season with salt and pepper.', 'Garnish with parsley and serve.'],
        cookingTime: 15,
        cuisine: 'mediterranean',
        mealType: 'dinner',
        dietaryStyle: 'none',
        mainFoods: ['prawns', 'shrimp', 'seafood'],
        matchingIngredients: ['garlic', 'butter', 'olive oil', 'wine', 'lemon', 'parsley', 'herbs']
      },
      {
        id: '4',
        title: 'Spicy Prawn Curry',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=300&fit=crop',
        description: 'Aromatic and spicy prawn curry with coconut milk.',
        ingredients: ['1 lb prawns, peeled and deveined', '1 can coconut milk', '2 onions, diced', '3 cloves garlic, minced', '1 inch ginger, grated', '2 tomatoes, chopped', '2 tbsp curry powder', '1 tsp turmeric', '2 tbsp vegetable oil'],
        steps: ['Heat oil in a large pan.', 'Add onions and cook until golden.', 'Add garlic, ginger, and spices.', 'Add tomatoes and cook until softened.', 'Pour in coconut milk and bring to a simmer.', 'Add prawns and cook for 3-4 minutes.', 'Season and garnish with cilantro.', 'Serve hot with rice.'],
        cookingTime: 25,
        cuisine: 'indian',
        mealType: 'dinner',
        dietaryStyle: 'none',
        mainFoods: ['prawns', 'shrimp', 'seafood'],
        matchingIngredients: ['coconut milk', 'onions', 'garlic', 'ginger', 'tomatoes', 'curry', 'rice', 'spices']
      },
      {
        id: '5',
        title: 'Honey Glazed Salmon',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=300&fit=crop',
        description: 'Perfectly cooked salmon with a sweet and tangy honey glaze.',
        ingredients: ['4 salmon fillets (6 oz each)', '1/4 cup honey', '2 tbsp soy sauce', '2 tbsp lemon juice', '2 cloves garlic, minced', '1 tsp ginger, grated', '2 tbsp olive oil', 'Salt and pepper to taste'],
        steps: ['Preheat oven to 400°F.', 'Mix honey, soy sauce, lemon juice, garlic, and ginger.', 'Season salmon with salt and pepper.', 'Heat oil in an oven-safe skillet.', 'Sear salmon for 2-3 minutes per side.', 'Brush with honey glaze and transfer to oven.', 'Bake for 8-10 minutes until cooked through.', 'Garnish and serve immediately.'],
        cookingTime: 20,
        cuisine: 'american',
        mealType: 'dinner',
        dietaryStyle: 'none',
        mainFoods: ['salmon', 'fish', 'seafood'],
        matchingIngredients: ['honey', 'soy sauce', 'lemon', 'garlic', 'ginger', 'olive oil', 'herbs']
      },
      {
        id: '6',
        title: 'Classic Beef Stir-Fry',
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=300&fit=crop',
        description: 'A quick and flavorful stir-fry with tender beef and crisp vegetables.',
        ingredients: ['1 lb beef sirloin, sliced thin', '2 bell peppers, sliced', '1 onion, sliced', '2 cups broccoli florets', '3 cloves garlic, minced', '1 tbsp ginger, grated', '3 tbsp soy sauce', '2 tbsp oyster sauce', '2 tbsp vegetable oil'],
        steps: ['Mix soy sauce and oyster sauce in a small bowl.', 'Heat oil in a large wok or pan over high heat.', 'Add beef and stir-fry for 2-3 minutes until browned.', 'Add garlic and ginger, stir-fry for 30 seconds.', 'Add vegetables and stir-fry for 3-4 minutes.', 'Pour sauce over everything and stir-fry for 1 minute.', 'Garnish with sesame seeds and serve over rice.'],
        cookingTime: 15,
        cuisine: 'asian',
        mealType: 'dinner',
        dietaryStyle: 'none',
        mainFoods: ['beef', 'meat'],
        matchingIngredients: ['bell peppers', 'onion', 'broccoli', 'garlic', 'ginger', 'soy sauce', 'oil', 'rice']
      },
      {
        id: '7',
        title: 'Roasted Vegetable Frittata',
        image: 'https://images.unsplash.com/photo-1572441713132-51c75654db73?w=500&h=300&fit=crop',
        description: 'A hearty and nutritious frittata loaded with roasted vegetables.',
        ingredients: ['8 large eggs', '2 cups mixed vegetables (zucchini, bell peppers, onions)', '1/2 cup milk', '1/2 cup cheese (cheddar or feta)', '2 tbsp olive oil', '2 cloves garlic, minced', 'Fresh herbs (thyme, rosemary)', 'Salt and pepper to taste'],
        steps: ['Preheat oven to 400°F.', 'Cut vegetables and toss with olive oil, salt, and pepper.', 'Roast vegetables for 20-25 minutes until tender.', 'Whisk eggs with milk, cheese, garlic, and herbs.', 'Heat an oven-safe skillet and add roasted vegetables.', 'Pour egg mixture over vegetables and cook on stovetop.', 'Transfer to oven and bake for 15-20 minutes.', 'Let cool slightly before slicing and serving.'],
        cookingTime: 45,
        cuisine: 'american',
        mealType: 'breakfast',
        dietaryStyle: 'vegetarian',
        mainFoods: ['eggs', 'vegetables'],
        matchingIngredients: ['vegetables', 'zucchini', 'bell peppers', 'onions', 'milk', 'cheese', 'olive oil', 'garlic', 'herbs']
      },
      {
        id: '8',
        title: 'Crispy Tofu Stir-Fry',
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=300&fit=crop',
        description: 'Crispy tofu with vegetables in a savory sauce.',
        ingredients: ['1 block firm tofu, cubed', '2 bell peppers, sliced', '1 onion, sliced', '2 cups broccoli florets', '3 cloves garlic, minced', '1 tbsp ginger, grated', '3 tbsp soy sauce', '2 tbsp sesame oil', '2 tbsp vegetable oil'],
        steps: ['Press tofu to remove excess water.', 'Heat oil in a large wok or pan.', 'Add tofu and cook until golden and crispy.', 'Add garlic and ginger, stir-fry for 30 seconds.', 'Add vegetables and stir-fry for 3-4 minutes.', 'Add soy sauce and sesame oil, toss to combine.', 'Garnish with sesame seeds and serve over rice.'],
        cookingTime: 20,
        cuisine: 'asian',
        mealType: 'dinner',
        dietaryStyle: 'vegan',
        mainFoods: ['tofu', 'vegetables'],
        matchingIngredients: ['bell peppers', 'onion', 'broccoli', 'garlic', 'ginger', 'soy sauce', 'oil', 'rice', 'sesame']
      },
      {
        id: '9',
        title: 'Mediterranean Quinoa Bowl',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop',
        description: 'A healthy and colorful bowl packed with Mediterranean flavors.',
        ingredients: ['1 cup quinoa', '1 cucumber, diced', '2 tomatoes, chopped', '1/2 red onion, sliced', '1/2 cup kalamata olives', '4 oz feta cheese, crumbled', '2 tbsp olive oil', '1 tbsp lemon juice'],
        steps: ['Cook quinoa according to package directions.', 'Prepare all vegetables and cut into pieces.', 'Combine quinoa with vegetables.', 'Add olives and feta cheese.', 'Drizzle with olive oil and lemon juice.', 'Season and serve.'],
        cookingTime: 20,
        cuisine: 'mediterranean',
        mealType: 'lunch',
        dietaryStyle: 'vegetarian',
        mainFoods: ['quinoa', 'rice', 'vegetables'],
        matchingIngredients: ['quinoa', 'cucumber', 'tomatoes', 'onion', 'olives', 'cheese', 'olive oil', 'lemon']
      },
      {
        id: '10',
        title: 'Roasted Vegetable Medley',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&h=300&fit=crop',
        description: 'A nutritious and colorful mix of roasted vegetables.',
        ingredients: ['2 sweet potatoes, cubed', '1 head broccoli, cut into florets', '2 bell peppers, sliced', '1 red onion, sliced', '2 tbsp olive oil', '2 cloves garlic, minced', 'Fresh herbs (thyme, rosemary)', 'Salt and pepper to taste'],
        steps: ['Preheat oven to 425°F.', 'Cut all vegetables into bite-sized pieces.', 'Toss vegetables with olive oil, garlic, herbs, salt, and pepper.', 'Spread on a baking sheet in a single layer.', 'Roast for 25-30 minutes until tender and golden.', 'Serve hot as a side dish or main course.'],
        cookingTime: 35,
        cuisine: 'american',
        mealType: 'lunch',
        dietaryStyle: 'vegan',
        mainFoods: ['vegetables'],
        matchingIngredients: ['sweet potatoes', 'broccoli', 'bell peppers', 'onion', 'olive oil', 'garlic', 'herbs']
      },
      {
        id: '11',
        title: 'Creamy Mushroom Risotto',
        image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=500&h=300&fit=crop',
        description: 'A luxurious and creamy risotto with earthy mushrooms.',
        ingredients: ['1 1/2 cups arborio rice', '8 oz mixed mushrooms, sliced', '1 onion, finely diced', '4 cups warm chicken or vegetable broth', '1/2 cup white wine', '1/2 cup parmesan cheese, grated', '3 tbsp butter', '2 tbsp olive oil', '2 cloves garlic, minced'],
        steps: ['Heat broth in a saucepan and keep warm.', 'Sauté mushrooms until golden brown, then set aside.', 'Add onion and garlic to the same pan, cook until softened.', 'Add rice and stir for 2 minutes until lightly toasted.', 'Add wine and stir until absorbed.', 'Add warm broth one ladle at a time, stirring constantly.', 'Continue adding broth and stirring for 18-20 minutes.', 'Stir in mushrooms, butter, and parmesan cheese.', 'Season and serve immediately.'],
        cookingTime: 35,
        cuisine: 'italian',
        mealType: 'dinner',
        dietaryStyle: 'vegetarian',
        mainFoods: ['rice', 'mushrooms', 'pasta'],
        matchingIngredients: ['rice', 'mushrooms', 'onion', 'broth', 'wine', 'cheese', 'butter', 'olive oil', 'garlic']
      },
      {
        id: '12',
        title: 'Creamy Tomato Basil Soup',
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=300&fit=crop',
        description: 'A comforting and creamy tomato soup with fresh basil.',
        ingredients: ['2 lbs tomatoes, chopped', '1 onion, diced', '4 cloves garlic, minced', '2 cups vegetable broth', '1/2 cup heavy cream', '1/4 cup fresh basil, chopped', '2 tbsp olive oil', '1 tsp sugar', 'Salt and pepper to taste'],
        steps: ['Heat olive oil in a large pot over medium heat.', 'Add onion and garlic, cook until softened.', 'Add tomatoes and cook for 10 minutes until broken down.', 'Add broth and bring to a boil, then simmer for 20 minutes.', 'Use an immersion blender to puree the soup.', 'Stir in cream, basil, sugar, salt, and pepper.', 'Simmer for 5 more minutes.', 'Serve hot with grated parmesan cheese.'],
        cookingTime: 45,
        cuisine: 'italian',
        mealType: 'lunch',
        dietaryStyle: 'vegetarian',
        mainFoods: ['tomatoes', 'vegetables'],
        matchingIngredients: ['tomatoes', 'onion', 'garlic', 'broth', 'cream', 'basil', 'olive oil', 'cheese']
      }
    ];

    console.log('API: Processing main food:', mainFood);

    // Function to check if a recipe matches the main food
    const matchesMainFood = (recipe, userMainFood) => {
      const userMainFoodLower = userMainFood.toLowerCase().trim();
      return recipe.mainFoods.some(food => 
        food.toLowerCase().includes(userMainFoodLower) || 
        userMainFoodLower.includes(food.toLowerCase())
      );
    };

    // Filter recipes that match the main food
    let matchedRecipes = allRecipes.filter(recipe => matchesMainFood(recipe, mainFood));

    console.log('API: Found recipes for', mainFood, ':', matchedRecipes.length);

    // If no exact matches, try fuzzy matching
    if (matchedRecipes.length === 0) {
      const fuzzyMatches = allRecipes.filter(recipe => 
        recipe.mainFoods.some(food => 
          food.toLowerCase().includes(mainFood.toLowerCase()) || 
          mainFood.toLowerCase().includes(food.toLowerCase())
        )
      );
      
      if (fuzzyMatches.length > 0) {
        matchedRecipes = fuzzyMatches;
        console.log('API: Using fuzzy matches:', matchedRecipes.length);
      }
    }

    // If still no matches, return a message
    if (matchedRecipes.length === 0) {
      console.log('API: No recipes found for', mainFood);
      return NextResponse.json({
        success: true,
        recipes: [],
        total: 0,
        message: `No recipes found for "${mainFood}". Try a different main food item like chicken, beef, fish, vegetables, etc.`
      });
    }

    // Function to calculate ingredient match score
    const calculateMatchScore = (recipe, userIngredients) => {
      let score = 0;
      const userIngredientsLower = userIngredients.map(ing => ing.toLowerCase().trim());
      
      recipe.matchingIngredients.forEach(ingredient => {
        const ingredientLower = ingredient.toLowerCase();
        userIngredientsLower.forEach(userIngredient => {
          if (ingredientLower.includes(userIngredient) || userIngredient.includes(ingredientLower)) {
            score += 1;
          }
        });
      });
      
      return score;
    };

    // Calculate match scores for each recipe
    const scoredRecipes = matchedRecipes.map(recipe => ({
      ...recipe,
      matchScore: calculateMatchScore(recipe, ingredients || [])
    }));

    // Sort by match score (highest first)
    scoredRecipes.sort((a, b) => b.matchScore - a.matchScore);

    console.log('API: Scored recipes:', scoredRecipes.map(r => ({ title: r.title, score: r.matchScore })));

    // Apply additional filters
    let filteredRecipes = scoredRecipes;

    if (filters && filters.cookingTime) {
      const maxTime = parseInt(filters.cookingTime);
      filteredRecipes = filteredRecipes.filter(recipe => recipe.cookingTime <= maxTime);
    }

    if (filters && filters.cuisine) {
      filteredRecipes = filteredRecipes.filter(recipe => recipe.cuisine === filters.cuisine);
    }

    if (filters && filters.mealType) {
      filteredRecipes = filteredRecipes.filter(recipe => recipe.mealType === filters.mealType);
    }

    if (filters && filters.dietaryStyle) {
      filteredRecipes = filteredRecipes.filter(recipe => recipe.dietaryStyle === filters.dietaryStyle);
    }

    // If filters are too restrictive, fall back to scored recipes
    if (filteredRecipes.length === 0) {
      console.log('API: Filters too restrictive, using scored recipes');
      filteredRecipes = scoredRecipes;
    }

    // Return up to 10 recipes
    const selectedRecipes = filteredRecipes.slice(0, 10);

    console.log('API: Returning recipes:', selectedRecipes.length);

    return NextResponse.json({
      success: true,
      recipes: selectedRecipes,
      total: selectedRecipes.length
    });

  } catch (error) {
    console.error('API: Error generating recipes:', error);
    console.error('API: Error type:', typeof error);
    console.error('API: Error message:', error?.message);
    console.error('API: Error stack:', error?.stack);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error?.message || 'Failed to generate recipes',
        details: error?.toString() || 'Unknown error'
      },
      { status: 500 }
    );
  }
}
