# Favicon Update Instructions

## What Was Changed:
1. ✅ Updated `src/app/layout.tsx` to use "Wave" branding
2. ✅ Added favicon reference to metadata
3. ✅ Updated page title to "Wave - Webhosting Services"

## What You Need to Do:

### Option 1: Use Your PNG Logo Directly (Easiest)
Modern browsers support PNG as favicon. Just:
1. Save your Wave logo as `logo.png` in `public/` folder
2. Update `src/app/layout.tsx` line 19 to:
```tsx
icon: "/logo.png",
```

### Option 2: Convert PNG to ICO (Recommended)
1. Go to: https://convertio.co/png-ico/
2. Upload your Wave logo.png
3. Download as favicon.ico
4. Replace `public/favicon.ico` with the new file
5. Layout already references this! ✅

### Option 3: Quick Online Conversion
1. Go to: https://icoconvert.com/
2. Upload your logo
3. Download favicon.ico
4. Replace `public/favicon.ico`

## To Deploy These Changes:

On your VPS:
```bash
ssh root@76.13.213.239
cd /root/apps/hosting-platform/Wave/hosting-platform

# Pull latest code from GitHub
git pull origin main

# Rebuild
npm run build

# Restart
pm2 restart Wave

# View logs
pm2 logs Wave
```

## Result:
Browser tab will show "Wave" favicon instead of Vercel! ✅
