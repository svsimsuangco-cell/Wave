import { NextRequest, NextResponse } from "next/server";

const PAYPAL_API_BASE = "https://api-m.sandbox.paypal.com";
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await response.json();
  return data.access_token;
}

async function capturePayPalOrder(paypalOrderId: string) {
  const accessToken = await getPayPalAccessToken();
  const response = await fetch(
    `${PAYPAL_API_BASE}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return await response.json();
}

export async function POST(req: NextRequest) {
  try {
    const { orderId: paypalOrderId, customOrderId } = await req.json();
    if (!paypalOrderId || !customOrderId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const captureData = await capturePayPalOrder(paypalOrderId);
    if (captureData.status !== "COMPLETED") {
      return NextResponse.json({ error: "Payment capture failed" }, { status: 400 });
    }
    return NextResponse.json({
      success: true,
      orderId: customOrderId,
      paypalOrderId: paypalOrderId,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to capture payment" }, { status: 500 });
  }
}