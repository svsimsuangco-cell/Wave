import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Plan from '@/models/Plan';
import { verifyToken } from '@/lib/auth';
import { JwtPayload } from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get user ID from auth token
    const token = request.cookies.get('auth')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token) as JwtPayload;
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const userId = decoded.userId;

    // Fetch user's orders
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    // Enrich orders with plan names
    const enrichedOrders = await Promise.all(
      orders.map(async (order: any) => {
        const items = await Promise.all(
          order.items.map(async (item: any) => {
            const plan = await Plan.findById(item.planId).lean();
            return {
              ...item,
              planName: plan?.name || 'Unknown Plan',
            };
          })
        );

        return {
          ...order,
          items,
        };
      })
    );

    return NextResponse.json(
      { success: true, data: enrichedOrders },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
