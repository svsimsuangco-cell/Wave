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

async function createPayPalOrder(amount: number, orderId: string, description: string) {
  const accessToken = await getPayPalAccessToken();
  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{
        reference_id: orderId,
        amount: { currency_code: "USD", value: amount.toFixed(2) },
        description: description,
      }],
    }),
  });
  const data = await response.json();
  return data;
}

export async function POST(req: NextRequest) {
  try {
    const { orderId, amount, description } = await req.json();
    if (!orderId || !amount || !description) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const paypalOrder = await createPayPalOrder(parseFloat(amount), orderId, description);
    return NextResponse.json({ id: paypalOrder.id });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create PayPal order" }, { status: 500 });
  }
}