import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Plan from '@/models/Plan';

export async function GET() {
  try {
    await dbConnect();

    const plans = await Plan.find({}).sort({ serviceId: 1, order: 1 });

    return NextResponse.json(
      { success: true, data: plans },
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
    const plan = await Plan.create(body);

    return NextResponse.json(
      { success: true, data: plan },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}
