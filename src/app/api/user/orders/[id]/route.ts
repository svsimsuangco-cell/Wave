import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Plan from '@/models/Plan';
import { verifyToken } from '@/lib/auth';
import { JwtPayload } from 'jsonwebtoken';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const token = request.cookies.get('auth')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = await verifyToken(token) as JwtPayload;
    if (!decoded) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const order = await Order.findOne({ _id: params.id, userId: decoded.userId }).lean() as any;
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const items = await Promise.all(
      order.items.map(async (item: any) => {
        const plan = await Plan.findById(item.planId).lean() as any;
        return {
          ...item,
          planName: plan?.name || 'Unknown Plan',
          planDescription: plan?.description || '',
        };
      })
    );

    return NextResponse.json({ success: true, data: { ...order, items } }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
