import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { verifyPayPalWebhookSignature } from '@/lib/paypal';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.text();
    const transmissionId = request.headers.get('paypal-transmission-id');
    const transmissionTime = request.headers.get('paypal-transmission-time');
    const certUrl = request.headers.get('paypal-cert-url');
    const webhookSignature = request.headers.get('paypal-auth-algo');
    const signatureHeader = request.headers.get('paypal-transmission-sig');

    if (!transmissionId || !transmissionTime || !certUrl || !signatureHeader) {
      return NextResponse.json(
        { error: 'Missing PayPal webhook headers' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const isValid = await verifyPayPalWebhookSignature(
      transmissionId,
      transmissionTime,
      certUrl,
      body,
      signatureHeader
    );

    if (!isValid) {
      console.warn('Invalid PayPal webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);

    // Handle PAYMENT.CAPTURE.COMPLETED webhook
    if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const orderId = event.resource.supplementary_data?.related_ids?.order_id;
      
      if (orderId) {
        await Order.findOneAndUpdate(
          { paypalOrderId: orderId },
          { status: 'completed' }
        );
      }
    }

    // Handle PAYMENT.CAPTURE.DENIED webhook
    if (event.event_type === 'PAYMENT.CAPTURE.DENIED') {
      const orderId = event.resource.supplementary_data?.related_ids?.order_id;
      
      if (orderId) {
        await Order.findOneAndUpdate(
          { paypalOrderId: orderId },
          { status: 'failed' }
        );
      }
    }

    // Handle PAYMENT.CAPTURE.REFUNDED webhook
    if (event.event_type === 'PAYMENT.CAPTURE.REFUNDED') {
      const orderId = event.resource.supplementary_data?.related_ids?.order_id;
      
      if (orderId) {
        await Order.findOneAndUpdate(
          { paypalOrderId: orderId },
          { status: 'cancelled' }
        );
      }
    }

    return NextResponse.json({ status: 'received' }, { status: 200 });
  } catch (error) {
    console.error('PayPal webhook error:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
