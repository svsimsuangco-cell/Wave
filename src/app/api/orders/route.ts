import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import Plan from '@/models/Plan';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    // Fetch orders with pagination
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get user details for each order
    const enrichedOrders = await Promise.all(
      orders.map(async (order: any) => {
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

        return {
          ...order,
          items,
          customerName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
          customerEmail: user?.email || order.billingInfo?.email || 'Unknown',
        };
      })
    );

    // Get total count
    const totalOrders = await Order.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        data: enrichedOrders,
        pagination: {
          total: totalOrders,
          page,
          limit,
          pages: Math.ceil(totalOrders / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { planId, billingInfo } = body;

    const plan = await Plan.findById(planId);
    if (!plan) {
      return NextResponse.json(
        { success: false, error: 'Plan not found' },
        { status: 404 }
      );
    }

    const orderNumber = `ORD-${Date.now()}`;

    const order = await Order.create({
      userId: 'guest-' + Date.now(),
      orderNumber,
      items: [
        {
          planId,
          quantity: 1,
          price: plan.basePricePerMonth,
        },
      ],
      totalPrice: plan.basePricePerMonth,
      status: 'pending',
      billingInfo,
    });

    return NextResponse.json(
      { success: true, data: order },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}
