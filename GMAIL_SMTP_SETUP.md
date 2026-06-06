# 📧 Complete Gmail SMTP Setup Guide

## ✅ Step 1: Enable 2-Factor Authentication on Gmail

1. Go to: https://myaccount.google.com/
2. Click **"Security"** in left menu
3. Scroll down to **"How you sign in to Google"**
4. Click **"2-Step Verification"**
5. Click **"Get Started"**
6. Follow the steps to enable 2FA
7. ✅ Done

---

## ✅ Step 2: Generate App Password

Once 2FA is enabled:

1. Go to: https://myaccount.google.com/apppasswords
2. Select:
   - **App**: Mail
   - **Device**: Windows PC (or your device)
3. Click **"Generate"**
4. Google will show you a 16-character password like: `abcd efgh ijkl mnop`
5. **Copy this password** (without spaces)
6. ✅ This is your SMTP password

---

## ✅ Step 3: Update `.env.local`

In your project's `.env.local`, update the email settings:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=abcdefghijklmnop
SMTP_FROM=noreply@hostinghub.com
```

**Replace:**
- `your_email@gmail.com` → Your actual Gmail address
- `abcdefghijklmnop` → The 16-character app password (NO SPACES)

### Example:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=john.doe@gmail.com
SMTP_PASSWORD=abcdefghijklmnop
SMTP_FROM=noreply@hostinghub.com
```

---

## ✅ Step 4: Restart Your App

1. **Stop** your dev server (Ctrl+C in terminal)
2. Run: `npm run dev`
3. ✅ App restarted with new SMTP settings

---

## ✅ Step 5: Test Email Verification

1. Go to: http://localhost:3000/auth/register
2. Fill in form and register
3. You should receive verification email in minutes
4. Click the link in the email
5. ✅ Email verification works!

---

## 🐛 Troubleshooting

### Email not arriving
- ✅ Check spam folder
- ✅ Verify SMTP_PASSWORD is correct (16 chars)
- ✅ Check app is restarted after `.env.local` change
- ✅ Make sure 2FA is enabled

### "Invalid credentials" error
- ✅ Double-check Gmail address spelling
- ✅ Verify app password has NO SPACES
- ✅ Regenerate app password if unsure

### "Connection refused" error
- ✅ Check SMTP_HOST: should be `smtp.gmail.com`
- ✅ Check SMTP_PORT: should be `587`
- ✅ Check SMTP_SECURE: should be `false`

### Still not working?
1. Check your email is correct
2. Check you enabled 2FA
3. Check app password was generated
4. Restart the dev server

---

## 📝 Your `.env.local` Should Look Like:

```env
MONGODB_URI=mongodb://localhost:27017/hosting-platform
NEXT_PUBLIC_API_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development

# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=abcdefghijklmnop
SMTP_FROM=noreply@hostinghub.com
```

---

## ✨ What Happens After Setup

When a user registers:
1. They fill the registration form
2. Password is hashed with bcrypt
3. **Verification email sent** to their Gmail inbox ✉️
4. Email contains a clickable verification link
5. Link lasts 24 hours
6. User clicks link → account verified
7. User can now login

---

## 🔐 Security Notes

- ✅ Never commit `.env.local` to git
- ✅ App password is different from Gmail password
- ✅ App password only works for Mail app
- ✅ You can revoke it anytime

---

## 📞 Need More Help?

- Gmail Security: https://myaccount.google.com/security
- App Passwords: https://myaccount.google.com/apppasswords
- Gmail SMTP: https://support.google.com/mail/answer/7126229

Let me know once you've set it up and tested! 🚀
