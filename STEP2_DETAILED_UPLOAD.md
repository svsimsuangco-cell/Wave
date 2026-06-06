# Step 2: Upload Application Files to VPS - DETAILED GUIDE

Complete walkthrough for getting your Next.js application onto your Hostinger VPS.

---

## Overview: You Have 2 Options

**Option A:** Clone from GitHub (If your code is on GitHub)  
**Option B:** Upload via FTP (If you have files locally)

---

## OPTION A: Clone from GitHub (EASIER & RECOMMENDED)

### What This Does:
Downloads your entire project from GitHub directly to your VPS server.

### Prerequisites:
- ✅ Your project must be on GitHub
- ✅ SSH access to VPS (which you have)

### Detailed Steps:

#### Step 1: SSH into Your VPS
Open your terminal/command prompt and connect:

```bash
ssh root@76.13.213.239
```

Enter your root password when prompted.

**You should see something like:**
```
root@ubuntu:~#
```

This means you're connected! ✅

#### Step 2: Verify You're in Home Directory
```bash
pwd
```

Should show: `/root`

#### Step 3: Create the Apps Directory Structure
```bash
mkdir -p /root/apps/hosting-platform
```

What this does:
- `mkdir -p` = Create directory and parent directories if they don't exist
- `/root/apps/` = Where your apps will live
- `/hosting-platform` = Your specific project folder

Verify it was created:
```bash
ls -la /root/apps/
```

Should show:
```
drwxr-xr-x  2 root root 4096 Jun  6 17:10 hosting-platform
```

#### Step 4: Navigate into the Directory
```bash
cd /root/apps/hosting-platform
```

Verify:
```bash
pwd
```

Should show: `/root/apps/hosting-platform`

#### Step 5: Clone from GitHub

**IMPORTANT:** Replace `YOUR_USERNAME` with your actual GitHub username!

```bash
git clone https://github.com/YOUR_USERNAME/hosting-platform.git .
```

**Note the `.` at the end** - it means "clone into current directory"

**Examples:**
```bash
# If your username is "john-doe":
git clone https://github.com/john-doe/hosting-platform.git .

# If your username is "sarah123":
git clone https://github.com/sarah123/hosting-platform.git .
```

#### Step 6: Wait for Clone to Complete

You'll see output like:
```
Cloning into '.'...
remote: Enumerating objects: 1234, done.
remote: Counting objects: 100% (1234/1234), done.
remote: Compressing objects: 100% (890/890), done.
Receiving objects: 100% (1234/1234), 5.23 MiB | 2.45 MiB/s, done.
Resolving deltas: 100% (456/456), done.
```

This takes 1-3 minutes depending on your project size.

#### Step 7: Verify Files Are There

```bash
ls -la
```

You should see:
```
-rw-r--r--  1 root root   234 Jun  6 17:10 package.json
-rw-r--r--  1 root root   567 Jun  6 17:10 README.md
-rw-r--r--  1 root root  1234 Jun  6 17:10 next.config.js
drwxr-xr-x  2 root root  4096 Jun  6 17:10 app/
drwxr-xr-x  2 root root  4096 Jun  6 17:10 pages/
drwxr-xr-x  2 root root  4096 Jun  6 17:10 public/
drwxr-xr-x  2 root root  4096 Jun  6 17:10 node_modules/  (might be missing, that's OK)
...
```

Great! Your files are on the server! ✅

---

## OPTION B: Upload via FTP (Alternative)

Use this if GitHub is complicated or your code isn't on GitHub yet.

### Prerequisites:
- ✅ FileZilla or another FTP client (free download)
- ✅ Hostinger FTP credentials

### Get Your FTP Credentials:

1. Login to Hostinger hPanel: https://hpanel.hostinger.com
2. Click on your VPS
3. Look for **File Manager** or **FTP**
4. You'll see something like:
   ```
   Host: 76.13.213.239
   Username: root
   Password: (same as SSH password)
   Port: 22 (for SFTP)
   ```

### Download FileZilla (if you don't have it):
- Go to: https://filezilla-project.org/
- Download **FileZilla Client** (NOT Server)
- Install it

### Connect via FTP in FileZilla:

#### Step 1: Open FileZilla
Click the icon on your desktop or applications menu.

#### Step 2: Go to File → Site Manager
Or press **Ctrl + S**

#### Step 3: Create New Site
Click **New Site**

#### Step 4: Fill in Details
```
Host: 76.13.213.239
Protocol: SFTP - SSH File Transfer Protocol
Logon Type: Normal
User: root
Password: (your root password)
Port: 22
```

#### Step 5: Connect
Click **Connect**

**You might see a security warning:**
```
The host key is not known. The host key fingerprint is:
... Do you trust this host key?
```

Click **Yes, add this key to the known hosts and continue**

#### Step 6: Navigate to Correct Folder
You're now in `/root/`

Create the folder structure:
1. Right-click in the empty space
2. Select **Create directory**
3. Name it: `apps`
4. Double-click to enter `apps/`
5. Right-click again
6. Select **Create directory**
7. Name it: `hosting-platform`
8. Double-click to enter `hosting-platform/`

You're now in: `/root/apps/hosting-platform/`

#### Step 7: Upload Your Files
On your local computer (LEFT SIDE of FileZilla):
1. Navigate to your hosting-platform folder
2. Select ALL files and folders (Ctrl + A)
3. Right-click and select **Upload**

Or drag-and-drop from left to right side.

**Wait for all files to upload** (you'll see progress bar)

#### Step 8: Verify Upload
Right-click in the server window (RIGHT SIDE) and select **Refresh** (F5)

You should see all your files:
- `package.json`
- `next.config.js`
- `app/` folder
- `pages/` folder
- `public/` folder
- `.env.local` (or `.env.example`)
- etc.

✅ Upload complete!

---

## After Upload: Next Steps (Same for Both Options)

Once files are on server, do this:

### Check Files Are Really There
```bash
cd /root/apps/hosting-platform
ls -la
```

Should show your files!

### Check package.json
```bash
cat package.json | head -20
```

Should show your project name and dependencies.

### Check if .env File Exists
```bash
ls -la .env*
```

Might show:
- `.env.local` (if you uploaded it)
- `.env.example` (template file)

**If `.env.production.local` doesn't exist, that's OK - we'll create it next**

---

## Troubleshooting

### Clone Error: "Permission denied"
**Solution:** Make sure you used `ssh root@...` (not just `ssh`)

### Clone Error: "fatal: destination path '.' already exists and is not an empty directory"
**Solution:** The directory isn't empty. Try:
```bash
cd /root/apps
rm -rf hosting-platform
mkdir hosting-platform
cd hosting-platform
git clone https://github.com/YOUR_USERNAME/hosting-platform.git .
```

### FTP Connection Refused
**Solution:**
1. Check you're using SFTP (not FTP)
2. Use port 22 (not 21)
3. Check VPS is running (should show "Running" in Hostinger)
4. Restart VPS if needed

### Files Show 0 Size After Upload
**Solution:** Upload was incomplete. Try uploading again.

### Missing node_modules Folder
**That's OK!** We'll install it with `npm install` next step.

### Missing .env File
**That's OK!** We'll create `.env.production.local` next step.

---

## Comparison: GitHub vs FTP

| Factor | GitHub | FTP |
|--------|--------|-----|
| **Speed** | Faster (CDN) | Slower (depends on connection) |
| **Setup** | 1 command | 10 clicks |
| **Best for** | Production | Quick uploads |
| **Reliability** | Very reliable | Can timeout on large files |
| **Requires** | GitHub account | FTP software |

**Recommendation:** Use GitHub if possible! 🚀

---

## Summary of Step 2

### What You Did:
✅ Created `/root/apps/hosting-platform/` directory  
✅ Cloned/uploaded your entire project  
✅ Verified files are on the server  

### What Happens Next:
1. Create `.env.production.local` file
2. Install dependencies: `npm install`
3. Build project: `npm run build`
4. Start with PM2: `pm2 start npm --name "hosting-platform" -- start`
5. Setup Nginx
6. Setup SSL
7. Point domain
8. 🎉 LIVE!

---

## Questions?

If you get stuck:
1. **What exact error do you see?** (copy-paste it)
2. **Which option did you use?** (GitHub or FTP)
3. **Can you see any files on the server?** (run `ls -la`)

Let me know! 😊

---

**Next: Step 3 - Create .env File**
