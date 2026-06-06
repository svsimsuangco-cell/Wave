import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { JwtPayload } from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    // Get the admin auth cookie
    const token = request.cookies.get('admin_auth')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify the token
    const decoded = await verifyToken(token) as JwtPayload;

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: true, authenticated: true, admin: decoded },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Authentication check failed' },
      { status: 401 }
    );
  }
}
