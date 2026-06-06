import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import Plan from '@/models/Plan';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Get user details
    const user = await User.findById(order.userId).lean();

    // Get plan details for items
    const items = await Promise.all(
      order.items.map(async (item: any) => {
        const plan = await Plan.findById(item.planId).lean();
        return {
          ...item,
          planName: plan?.name || 'Unknown Plan',
          planDescription: plan?.description || '',
        };
      })
    );

    const enrichedOrder = {
      ...order,
      items,
      customerName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
      customerEmail: user?.email || order.billingInfo?.email || 'Unknown',
    };

    return NextResponse.json(
      { success: true, data: enrichedOrder },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    const { status } = await request.json();

    if (!['pending', 'working_on_it', 'completed', 'failed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status' },
        { status: 400 }
      );
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Get user details
    const user = await User.findById(order.userId).lean();

    // Get plan details for items
    const items = await Promise.all(
      order.items.map(async (item: any) => {
        const plan = await Plan.findById(item.planId).lean();
        return {
          ...item,
          planName: plan?.name || 'Unknown Plan',
          planDescription: plan?.description || '',
        };
      })
    );

    const enrichedOrder = {
      ...order,
      items,
      customerName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
      customerEmail: user?.email || order.billingInfo?.email || 'Unknown',
    };

    return NextResponse.json(
      { success: true, data: enrichedOrder },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
