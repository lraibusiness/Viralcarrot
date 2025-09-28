import { NextRequest, NextResponse } from 'next/server';
import { AuthService, requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      subscription: user.subscription
    });

  } catch (error) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { plan, status, expiresAt } = await request.json();
    
    const updatedUser = await AuthService.updateSubscription(user.id, {
      plan: plan || user.subscription?.plan || 'free',
      status: status || user.subscription?.status || 'active',
      expiresAt: expiresAt ? new Date(expiresAt) : user.subscription?.expiresAt
    });

    return NextResponse.json({
      success: true,
      subscription: updatedUser.subscription
    });

  } catch (error) {
    console.error('Subscription update error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}
