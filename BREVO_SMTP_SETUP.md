# 📧 Brevo SMTP Setup Guide (Easy Email - No Personal Account Needed!)

## ✅ Step 1: Create Brevo Account

1. Go to: https://www.brevo.com/
2. Click **"Sign up free"** (top right)
3. Fill in:
   - Email: any email you have access to
   - Password: something secure
   - Company: Your company name
4. Click **"Create my account"**
5. ✅ You'll receive a verification email - click the link

---

## ✅ Step 2: Get Your SMTP Credentials

1. Login to Brevo: https://app.brevo.com
2. Click on your **Profile** (top right)
3. Go to **"SMTP & API"**
4. You'll see:
   - **SMTP Server**: `smtp-relay.brevo.com`
   - **Port**: `587`
   - **SMTP Login**: (your email or a key)
   - **SMTP Password**: (you may need to generate one)

5. If password isn't shown, click **"Generate SMTP key"**
6. Copy both the login and password

---

## ✅ Step 3: Update `.env.local`

```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_brevo_email@gmail.com
SMTP_PASSWORD=your_brevo_smtp_password
SMTP_FROM=noreply@hostinghub.com
```

**Replace:**
- `your_brevo_email@gmail.com` → The email you used to sign up with Brevo
- `your_brevo_smtp_password` → The SMTP password from Step 2

### Example:
```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=john@example.com
SMTP_PASSWORD=xsmtpd3c05bfe1a82e07
SMTP_FROM=noreply@hostinghub.com
```

---

## ✅ Step 4: Restart App

1. Stop dev server (Ctrl+C)
2. Run: `npm run dev`
3. ✅ Now email should work!

---

## ✅ Step 5: Test Email

1. Go to: http://localhost:3000/auth/register
2. Register with any email
3. Check email for verification link
4. Click link to verify
5. ✅ Success!

---

## 💰 Brevo Free Plan

- **300 emails/day** ✅
- **Unlimited contacts**
- **30 day free trial** with full features
- After trial: still free tier with 300/day

Perfect for development and small projects!

---

## 🔗 Brevo Account Links

- Dashboard: https://app.brevo.com
- SMTP Settings: https://app.brevo.com/settings/smtp
- Documentation: https://www.brevo.com/help/

---

## 🐛 Troubleshooting

### "Authentication failed" error
- ✅ Check SMTP_USER is correct (email from signup)
- ✅ Check SMTP_PASSWORD is correct
- ✅ Regenerate password if unsure

### Email not arriving
- ✅ Check spam folder
- ✅ Verify email sent shows in Brevo dashboard
- ✅ Check SMTP_HOST: `smtp-relay.brevo.com`

### Can't find SMTP credentials
- ✅ Login to https://app.brevo.com
- ✅ Click profile → "SMTP & API"
- ✅ Look for "SMTP Relay"

---

Let me know once you're set up and verified! 🚀
