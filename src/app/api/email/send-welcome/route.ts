import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, getWelcomeEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, userName } = await request.json();

    const emailHtml = getWelcomeEmail(userName);
    const result = await sendEmail(
      email,
      'Welcome to HostingHub!',
      emailHtml
    );

    if (result.success) {
      return NextResponse.json(
        { success: true, message: 'Welcome email sent successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
