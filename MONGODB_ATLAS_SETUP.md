# 🗄️ MongoDB Atlas Setup Guide

## Step 1: Create a MongoDB Atlas Account

1. Go to **https://www.mongodb.com/cloud/atlas**
2. Click **"Try Free"** or **"Sign Up"**
3. Fill in your details:
   - Email
   - Password
   - Accept terms
4. Click **"Create account"**
5. Verify your email

---

## Step 2: Create a Cluster

1. After signing up, you'll see the Atlas dashboard
2. Click **"Build a Database"** (or "Create" button)
3. Choose **"M0 FREE"** tier (perfect for development)
4. Select your region (closest to you is best)
5. Click **"Create Deployment"**
6. Wait for cluster to be created (2-3 minutes)

---

## Step 3: Set Up Database User

1. Click **"Database Access"** in left menu
2. Click **"Add New Database User"**
3. Enter:
   - **Username**: `hostingadmin` (or your choice)
   - **Password**: Create a strong password (save it!)
4. Click **"Add User"**

---

## Step 4: Whitelist Your IP

1. Click **"Network Access"** in left menu
2. Click **"Add IP Address"**
3. Click **"Add Current IP Address"** (automatic)
   - OR select **"Allow Access from Anywhere"** for development
4. Click **"Confirm"**

---

## Step 5: Get Connection String

1. Go back to **"Databases"**
2. Click **"Connect"** on your cluster
3. Select **"Drivers"**
4. Choose **"Node.js"** and version **4.1 or later**
5. Copy the connection string

Example format:
```
mongodb+srv://hostingadmin:password@cluster0.xxxxx.mongodb.net/hosting-platform?retryWrites=true&w=majority
```

**Replace:**
- `hostingadmin` with your username
- `password` with your actual password

---

## Step 6: Update `.env.local`

In your project's `.env.local` file, replace the MongoDB URI:

```env
MONGODB_URI=mongodb+srv://hostingadmin:yourpassword@cluster0.xxxxx.mongodb.net/hosting-platform?retryWrites=true&w=majority
```

**Complete example:**
```
MONGODB_URI=mongodb+srv://hostingadmin:myPassword123@cluster0.a1b2c3d.mongodb.net/hosting-platform?retryWrites=true&w=majority
NEXT_PUBLIC_API_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@hostinghub.com
```

---

## Step 7: Run Seed Script

Once `.env.local` is updated with your MongoDB Atlas URL:

```bash
npm run seed
```

You should see:
```
✅ Connected to MongoDB
🧹 Cleared services collection
✅ Inserted 4 services
✅ Inserted 12 pricing plans
✅ Created default admin account

✨ Database seeding completed successfully!

📌 Default Admin Credentials:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📧 Email:    admin@hosting.com
   🔑 Password: admin123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Step 8: Start Your Application

```bash
npm run dev
```

Visit: http://localhost:3000

---

## 🎯 You're All Set!

Your database is now ready with:
- ✅ 4 Services (Web Hosting, Cloud Servers, VPS, Dedicated)
- ✅ 12 Pricing Plans
- ✅ 1 Admin Account

### Test It:

**Admin Login:**
- URL: http://localhost:3000/admin/login
- Email: `admin@hosting.com`
- Password: `admin123`
- Will redirect to: http://localhost:3000/admin/dashboard

**User Registration:**
- URL: http://localhost:3000/auth/register
- Register a new account
- Verify email (check console or email)
- Login at: http://localhost:3000/auth/login
- Will redirect to: http://localhost:3000/dashboard

---

## 🔒 Security Tips

1. **Change Admin Password** after first login
2. **Use Strong Passwords** for MongoDB Atlas
3. **Keep API Keys Secret** (never commit `.env.local`)
4. **Enable IP Whitelist** in MongoDB Atlas
5. **Use HTTPS in Production** (Vercel does this automatically)

---

## 🐛 Troubleshooting

### Connection Refused
- ✅ Make sure MongoDB URI is correct in `.env.local`
- ✅ Check IP is whitelisted in MongoDB Atlas
- ✅ Verify username and password are correct

### Authentication Failed
- ✅ Check database user credentials
- ✅ Ensure special characters in password are URL-encoded

### Can't Connect to Local MongoDB
- If you want local MongoDB instead, follow the "Local MongoDB Setup" section below

---

## 📦 Local MongoDB Setup (Alternative)

If you prefer local MongoDB instead of Atlas:

### Windows - Using MongoDB Installer:
1. Download: https://www.mongodb.com/try/download/community
2. Run installer and follow setup
3. MongoDB runs on `localhost:27017` by default

### Windows - Using Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Mac:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux:
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

Then use the default URI:
```
MONGODB_URI=mongodb://localhost:27017/hosting-platform
```

---

## 📚 Need Help?

- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **MongoDB Connection Guide**: https://www.mongodb.com/docs/drivers/node/

**Next Steps**: Update `.env.local` with your MongoDB Atlas connection string, then run `npm run seed` to populate your database!
