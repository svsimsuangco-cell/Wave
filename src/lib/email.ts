import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@hostinghub.com',
      to,
      subject,
      html,
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: (error as Error).message };
  }
}

export function getOrderConfirmationEmail(order: any, planName: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .content { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .footer { text-align: center; color: #666; font-size: 12px; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          .table th { background: #f0f0f0; font-weight: bold; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Order Confirmation</h1>
            <p>Thank you for your purchase!</p>
          </div>

          <div class="content">
            <h2>Order Details</h2>
            <table class="table">
              <tr>
                <th>Item</th>
                <td>${planName}</td>
              </tr>
              <tr>
                <th>Order Number</th>
                <td>${order.orderNumber}</td>
              </tr>
              <tr>
                <th>Amount</th>
                <td>$${order.totalPrice.toFixed(2)}/month</td>
              </tr>
              <tr>
                <th>Date</th>
                <td>${new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            </table>

            <h2>Next Steps</h2>
            <ul>
              <li>Payment information has been processed securely through Stripe</li>
              <li>Your service is being provisioned</li>
              <li>You will receive login credentials within 24 hours</li>
              <li>Contact support if you have any questions</li>
            </ul>

            <a href="${process.env.NEXT_PUBLIC_API_URL}/order-confirmation/${order._id}" class="button">
              View Order Details
            </a>
          </div>

          <div class="footer">
            <p>© 2026 HostingHub. All rights reserved.</p>
            <p>If you have questions, contact us at support@hostinghub.com</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getWelcomeEmail(userName: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .content { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .footer { text-align: center; color: #666; font-size: 12px; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to HostingHub!</h1>
            <p>We're excited to have you on board</p>
          </div>

          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>Thank you for creating an account with HostingHub. We're thrilled to provide you with reliable hosting solutions.</p>

            <h3>What You Can Do Now:</h3>
            <ul>
              <li>Browse our hosting services</li>
              <li>Explore different pricing plans</li>
              <li>Manage your account settings</li>
              <li>Track your orders and services</li>
            </ul>

            <p>If you have any questions or need assistance, our support team is here to help!</p>

            <a href="${process.env.NEXT_PUBLIC_API_URL}/services" class="button">
              Browse Services
            </a>
          </div>

          <div class="footer">
            <p>© 2026 HostingHub. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getVerificationEmail(userName: string, verificationLink: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .content { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .footer { text-align: center; color: #666; font-size: 12px; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-top: 20px; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Email Address</h1>
            <p>One more step to activate your account</p>
          </div>

          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>Welcome to HostingHub! To activate your account and start using our services, please verify your email address by clicking the button below.</p>

            <a href="${verificationLink}" class="button">
              Verify My Email
            </a>

            <p style="margin-top: 20px; color: #666;">
              Or copy and paste this link in your browser:<br>
              <code style="background: #e0e0e0; padding: 10px; border-radius: 4px; display: block; word-break: break-all;">
                ${verificationLink}
              </code>
            </p>

            <div class="warning">
              <strong>⏰ This link expires in 24 hours</strong><br>
              If you didn't create this account, you can safely ignore this email.
            </div>

            <p style="margin-top: 20px; color: #666;">
              Once verified, you'll be able to:<br>
              ✓ Browse our hosting services<br>
              ✓ Choose and purchase plans<br>
              ✓ Manage your account<br>
              ✓ Access your orders and services
            </p>
          </div>

          <div class="footer">
            <p>© 2026 HostingHub. All rights reserved.</p>
            <p style="color: #999; font-size: 11px;">HostingHub - Reliable Web Hosting Solutions</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
