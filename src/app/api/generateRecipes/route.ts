import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ingredients, filters } = body;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Sample recipes
    const recipes = [
      {
        id: '1',
        title: 'Creamy Garlic Chicken Pasta',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop',
        description: 'A rich and creamy pasta dish with tender chicken and aromatic garlic, perfect for a cozy dinner.',
        ingredients: [
          '2 chicken breasts, diced',
          '8 oz pasta',
          '4 cloves garlic, minced',
          '1 cup heavy cream',
          '1/2 cup parmesan cheese',
          '2 tbsp butter',
          'Salt and pepper to taste',
          'Fresh parsley for garnish'
        ],
        steps: [
          'Cook pasta according to package directions until al dente.',
          'Season chicken with salt and pepper, then cook in a large pan until golden brown.',
          'Add minced garlic and cook for 1 minute until fragrant.',
          'Pour in heavy cream and bring to a gentle simmer.',
          'Add cooked pasta and parmesan cheese, tossing until well combined.',
          'Garnish with fresh parsley and serve immediately.'
        ],
        cookingTime: 25
      },
      {
        id: '2',
        title: 'Mediterranean Quinoa Bowl',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=300&fit=crop',
        description: 'A healthy and colorful bowl packed with Mediterranean flavors and nutritious quinoa.',
        ingredients: [
          '1 cup quinoa',
          '1 cucumber, diced',
          '2 tomatoes, chopped',
          '1/2 red onion, sliced',
          '1/2 cup kalamata olives',
          '4 oz feta cheese, crumbled',
          '2 tbsp olive oil',
          '1 tbsp lemon juice',
          'Fresh herbs (oregano, basil)',
          'Salt and pepper to taste'
        ],
        steps: [
          'Cook quinoa according to package directions and let cool.',
          'Prepare all vegetables and cut into bite-sized pieces.',
          'In a large bowl, combine cooled quinoa with vegetables.',
          'Add olives and crumbled feta cheese.',
          'Drizzle with olive oil and lemon juice.',
          'Season with salt, pepper, and fresh herbs. Toss gently and serve.'
        ],
        cookingTime: 20
      }
    ];

    return NextResponse.json({
      success: true,
      recipes: recipes,
      total: recipes.length
    });

  } catch (error) {
    console.error('Error generating recipes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate recipes' },
      { status: 500 }
    );
  }
}
