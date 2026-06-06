interface PayPalAccessToken {
  scope: string;
  app_id: string;
  expires_in: number;
  access_token: string;
  token_type: string;
}

interface PayPalCreateOrderResponse {
  id: string;
  status: string;
  links: Array<{
    rel: string;
    href: string;
  }>;
}

interface PayPalCaptureOrderResponse {
  id: string;
  status: string;
  payer: {
    email_address: string;
    payer_id: string;
  };
  purchase_units: Array<{
    amount: {
      value: string;
      currency_code: string;
    };
  }>;
}

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  // Check if cached token is still valid
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now()) {
    return cachedAccessToken.token;
  }

  const auth = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
  ).toString('base64');

  const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error(`Failed to get PayPal access token: ${response.statusText}`);
  }

  const data = (await response.json()) as PayPalAccessToken;

  // Cache the token for 95% of its lifetime
  cachedAccessToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000 * 0.95,
  };

  return data.access_token;
}

export async function createPayPalOrder(
  amount: string,
  currency: string = 'USD'
): Promise<PayPalCreateOrderResponse> {
  const accessToken = await getAccessToken();

  const orderPayload = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: amount,
        },
      },
    ],
    application_context: {
      brand_name: 'Wave Webhosting Services',
      landing_page: 'LOGIN',
      user_action: 'PAY_NOW',
      return_url: `${process.env.NEXT_PUBLIC_API_URL}/order-success`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
    },
  };

  const response = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(orderPayload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create PayPal order: ${error}`);
  }

  return response.json();
}

export async function capturePayPalOrder(
  orderId: string
): Promise<PayPalCaptureOrderResponse> {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to capture PayPal order: ${error}`);
  }

  return response.json();
}

export async function getPayPalOrder(orderId: string) {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get PayPal order: ${response.statusText}`);
  }

  return response.json();
}

export async function verifyPayPalWebhookSignature(
  transmissionId: string,
  transmissionTime: string,
  certUrl: string,
  webhookBody: string,
  webhookSignature: string
): Promise<boolean> {
  const accessToken = await getAccessToken();

  const response = await fetch(
    'https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        transmission_id: transmissionId,
        transmission_time: transmissionTime,
        cert_url: certUrl,
        auth_algo: 'SHA256withRSA',
        webhook_body: webhookBody,
        webhook_signature: webhookSignature,
        webhook_id: process.env.PAYPAL_WEBHOOK_ID,
      }),
    }
  );

  if (!response.ok) {
    return false;
  }

  const data = await response.json();
  return data.verification_status === 'SUCCESS';
}
