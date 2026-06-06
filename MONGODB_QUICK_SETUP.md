# 🚀 Quick MongoDB Setup for Windows (Without Installer)

## Option 1: MongoDB Installer (Easiest - 5 minutes)

1. Download: https://www.mongodb.com/try/download/community
2. Run the `.msi` installer
3. Click "Next" through all steps
4. Check "Install MongoDB as a Service"
5. Finish installation

MongoDB will then run automatically on `localhost:27017`

---

## Option 2: MongoDB Portable (No Installation Needed)

If you want something that works immediately without installation:

### Step 1: Download
- Go to: https://www.mongodb.com/try/download/community
- Select **Platform**: Windows
- Select **Package**: ZIP
- Click Download
- This gives you a portable folder

### Step 2: Extract
- Extract the ZIP file somewhere (e.g., `C:\mongodb`)
- You'll see a `bin` folder inside

### Step 3: Start MongoDB
Open PowerShell and run:
```powershell
C:\mongodb\bin\mongod.exe
```

You should see:
```
[initandlisten] waiting for connections on port 27017
```

✅ **MongoDB is now running!**

---

## Option 3: Use Online MongoDB Atlas (Free)

Since you already have a cluster created, the issue is the password. 

**To fix it:**

1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Database Access" 
3. Click "Edit" on the admin user
4. Click "Edit Password"
5. Set a new password (no special characters, or properly URL encode them)
6. Update your `.env.local` with the new password

Example:
```
MONGODB_URI=mongodb+srv://admin:newpassword@hosting-platform.edvkrgj.mongodb.net/hosting-platform?retryWrites=true&w=majority
```

---

## Solution Recommendation

✅ **Option 1** = Easiest, most reliable
✅ **Option 2** = Works without installation
✅ **Option 3** = If you want cloud (requires fixing password)

**For now, I recommend Option 1 or 2** since they're local and don't require external setup.

---

## After Setup

Once MongoDB is running (using Option 1 or 2):

Update `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/hosting-platform
```

Then try:
```
http://localhost:3000/api/seed
```

Should see: `{ "success": true, ... }`
