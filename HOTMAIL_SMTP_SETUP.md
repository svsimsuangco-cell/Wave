# 📧 Outlook/Hotmail SMTP Setup Guide

## ✅ Step 1: Create/Use Your Outlook Email

If you don't have an Outlook account:
1. Go to: https://outlook.live.com
2. Click **"Create account"**
3. Fill in details (can use existing email or create @outlook.com address)
4. Verify and login

---

## ✅ Step 2: Enable IMAP/SMTP Access

1. Login to: https://outlook.live.com/mail/
2. Click ⚙️ **Settings** (gear icon, top right)
3. Click **"View all Outlook settings"**
4. Go to **"Mail"** → **"Sync email"**
5. Under **"IMAP and POP"**, turn ON **"Let devices and apps use IMAP"**
6. Click **"Save"**
7. ✅ Done

---

## ✅ Step 3: Generate App Password (Optional)

For better security, generate an app password:
1. Go to: https://account.microsoft.com/security
2. Click **"App passwords"** (if available)
3. Select Mail + Windows
4. Copy the password
5. Use this instead of your Outlook password

**OR** just use your Outlook password directly (simpler for development)

---

## ✅ Step 4: Update `.env.local`

Replace the Gmail settings with Outlook:

```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@outlook.com
SMTP_PASSWORD=your_outlook_password
SMTP_FROM=noreply@hostinghub.com
```

**Replace:**
- `your_email@outlook.com` → Your actual Outlook/Hotmail email
- `your_outlook_password` → Your Outlook password (or app password if generated)

### Example:
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=john.doe@outlook.com
SMTP_PASSWORD=MySecurePassword123
SMTP_FROM=noreply@hostinghub.com
```

---

## ✅ Step 5: Restart Your App

1. **Stop** your dev server (Ctrl+C)
2. Run: `npm run dev`
3. ✅ App restarted with Outlook settings

---

## ✅ Step 6: Test Email Verification

1. Go to: http://localhost:3000/auth/register
2. Register with a test email
3. You should receive verification email
4. Click the link to verify
5. ✅ Now you can login!

---

## 🐛 Troubleshooting

### Email not arriving
- ✅ Check spam folder
- ✅ Verify SMTP_USER is correct Outlook email
- ✅ Verify SMTP_PASSWORD is correct
- ✅ Restart dev server after changes

### "Invalid credentials" error
- ✅ Check Outlook email spelling
- ✅ Check password is correct
- ✅ Make sure IMAP is enabled (Step 2)

### "Connection refused"
- ✅ SMTP_HOST should be: `smtp-mail.outlook.com`
- ✅ SMTP_PORT should be: `587`
- ✅ SMTP_SECURE should be: `false`

---

## 📝 Your `.env.local` Should Now Look Like:

```env
MONGODB_URI=mongodb://localhost:27017/hosting-platform
NEXT_PUBLIC_API_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development

# Email Configuration (Outlook/Hotmail)
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@outlook.com
SMTP_PASSWORD=your_password_here
SMTP_FROM=noreply@hostinghub.com
```

---

## ✨ Outlook SMTP Servers

- **Regular SMTP**: `smtp-mail.outlook.com:587` (what we're using)
- **Alternative**: `smtp.live.com:587`
- **SSL/TLS**: `smtp-mail.outlook.com:465`

We're using **587 with STARTTLS** (most compatible).

---

## 🔐 Security Notes

- ✅ Store password in `.env.local` only (never commit to git)
- ✅ For production, use app password if available
- ✅ Consider using SendGrid or Brevo for production

---

Let me know once you've set this up and tested! 🚀
