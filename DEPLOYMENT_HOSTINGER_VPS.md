# Hostinger VPS + Next.js Deployment Guide

Complete guide to deploy the Next.js hosting platform on Hostinger VPS.

---

## Prerequisites

- ✅ Hostinger VPS plan (Business VPS or higher)
- ✅ Domain name (update DNS settings)
- ✅ Stripe API keys (production)
- ✅ MongoDB Atlas account (or local MongoDB)
- ✅ SMTP email credentials (Hostinger, Gmail, Brevo, etc.)
- ✅ GitHub account with repository uploaded
- ✅ SSH client (PuTTY, OpenSSH, or Terminal)

---

## Step 1: Upgrade to Hostinger VPS

### Cost
- Business VPS: $3.99-5.99/month
- Professional VPS: $9.99-14.99/month
- Ultimate VPS: $19.99-29.99/month

### What's Included
- ✅ Full root SSH access
- ✅ 2-4 vCPU cores
- ✅ 2-4 GB RAM
- ✅ 40-100 GB SSD storage
- ✅ cPanel control panel
- ✅ Unlimited bandwidth
- ✅ Free SSL/HTTPS

### How to Upgrade
1. Login to Hostinger hPanel
2. Navigate to VPS Hosting
3. Select desired plan
4. Proceed to checkout
5. Activate VPS

---

## Step 2: Access Your VPS

### Get SSH Credentials
1. In hPanel, go to **VPS Management**
2. Click your VPS name
3. Find **SSH Access** section
4. Note: `Host`, `Port`, `Username`, `Password`

### Connect via SSH

**Windows (Command Prompt or PowerShell):**
```bash
ssh username@123.45.67.89 -p 22
# Enter password when prompted
```

**Mac/Linux (Terminal):**
```bash
ssh username@123.45.67.89
# Enter password when prompted
```

**PuTTY (GUI):**
1. Open PuTTY
2. Host: `123.45.67.89`
3. Port: `22`
4. Username: your username
5. Click Open
6. Enter password

### Verify Connection
```bash
pwd  # Should show /home/username
ls   # Should list files
```

---

## Step 3: System Setup

### Update System
```bash
sudo apt update
sudo apt upgrade -y
```

### Install Essential Tools
```bash
sudo apt install -y build-essential curl wget git
```

### Install Node.js (Latest LTS)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### Verify Installation
```bash
node -v    # Should show v18.x.x
npm -v     # Should show 8.x or 9.x
```

### Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
pm2 startup
```

---

## Step 4: Install MongoDB (Optional)

**Skip this if using MongoDB Atlas cloud.**

### Install MongoDB Community Edition
```bash
sudo apt-get install -y gnupg curl
curl https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-5.0.gpg ] http://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

### Start MongoDB
```bash
sudo systemctl start mongod
sudo systemctl enable mongod  # Auto-start on reboot
sudo systemctl status mongod
```

### Verify MongoDB
```bash
mongo --eval "db.adminCommand('ping')"
# Should return: { ok: 1 }
```

---

## Step 5: Setup Application Directory

### Create App Directory
```bash
cd ~
mkdir -p apps
cd apps
mkdir hosting-platform
cd hosting-platform
```

### Clone from GitHub
```bash
git clone https://github.com/YOUR_USERNAME/hosting-platform.git .
```

Or upload via FTP if not on GitHub.

---

## Step 6: Configure Application

### Create .env File
```bash
nano .env.production.local
```

Add (adjust values):
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hosting_platform?retryWrites=true&w=majority

# Or if local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/hosting_platform

# Application
NEXT_PUBLIC_API_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_random_secret_here_min_32_chars
NEXTAUTH_URL=https://yourdomain.com

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Email
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=your_email@yourdomain.com
SMTP_PASSWORD=your_email_password
SMTP_FROM=noreply@yourdomain.com

# Admin
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your_secure_admin_password
```

### Save and Exit
```
Press: Ctrl + X
Then: Y
Then: Enter
```

---

## Step 7: Install Dependencies & Build

### Install Node Modules
```bash
npm install
```

This takes 3-5 minutes.

### Build Application
```bash
npm run build
```

This compiles Next.js and creates the `.next/` directory.

### Verify Build Success
```bash
ls -la .next/
# Should show many files/folders
```

---

## Step 8: Start Application with PM2

### Start Application
```bash
pm2 start npm --name "hosting-platform" -- start
```

### Verify It's Running
```bash
pm2 status
# Should show: hosting-platform (id 0) online
```

### View Logs
```bash
pm2 logs hosting-platform
# Should show: "ready - started server on 0.0.0.0:3000"
```

### Setup Auto-Start on Reboot
```bash
pm2 startup
pm2 save
```

---

## Step 9: Install & Configure Nginx

### Install Nginx
```bash
sudo apt install -y nginx
```

### Create Nginx Config
```bash
sudo nano /etc/nginx/sites-available/hosting-platform
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Enable Configuration
```bash
sudo ln -s /etc/nginx/sites-available/hosting-platform /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t  # Test config
sudo systemctl restart nginx
```

---

## Step 10: Setup SSL Certificate (HTTPS)

### Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Generate SSL Certificate
```bash
sudo certbot certify-only --nginx -d yourdomain.com -d www.yourdomain.com
```

### Auto-Renewal
```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Verify HTTPS
Visit: `https://yourdomain.com` in browser

---

## Step 11: Point Domain to VPS

### Get VPS IP Address
```bash
hostname -I
# Shows: 123.45.67.89 (your VPS IP)
```

### Update DNS Records
In your domain registrar (GoDaddy, Namecheap, etc.):

1. Go to DNS Settings
2. Create/Update `A` record:
   - Name: `@`
   - Type: `A`
   - Value: `123.45.67.89`
3. Create `CNAME` record:
   - Name: `www`
   - Type: `CNAME`
   - Value: `yourdomain.com`
4. Save changes

**Note:** DNS takes 15 minutes to 24 hours to propagate.

### Verify DNS (After Propagation)
```bash
nslookup yourdomain.com
# Should show: 123.45.67.89
```

---

## Step 12: Configure Stripe Webhooks

### Get Webhook Endpoint URL
```
https://yourdomain.com/api/webhooks/stripe
```

### Add to Stripe Dashboard
1. Login to Stripe Dashboard
2. Go to **Developers** → **Webhooks**
3. Click **Add Endpoint**
4. URL: `https://yourdomain.com/api/webhooks/stripe`
5. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
6. Click **Add Endpoint**
7. Copy **Signing Secret**
8. Add to `.env.production.local`: `STRIPE_WEBHOOK_SECRET=whsec_xxx`

### Restart Application
```bash
pm2 restart hosting-platform
```

---

## Step 13: Database Setup

### If Using MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Create database user
4. Get connection string
5. Update `MONGODB_URI` in `.env`

### If Using Local MongoDB
```bash
# Connect to MongoDB
mongo

# Create database
use hosting_platform

# Create collections (auto-created on insert)
db.users.insertOne({})
db.services.insertOne({})
db.plans.insertOne({})

# Exit
exit
```

---

## Step 14: Seed Database (Optional)

### Create Seed Script
```bash
nano scripts/seed-production.js
```

Add sample services, plans, and admin account.

### Run Seed Script
```bash
node scripts/seed-production.js
```

---

## Step 15: Testing

### Test Homepage
```bash
curl https://yourdomain.com
# Should show HTML content
```

### Test Registration
1. Visit: `https://yourdomain.com/register`
2. Create test account
3. Check email for verification link

### Test Admin
1. Visit: `https://yourdomain.com/admin`
2. Login with admin credentials

### Test Payment
1. Add service to cart
2. Checkout
3. Use Stripe test card: `4242 4242 4242 4242`
4. Verify order created

### View Logs
```bash
pm2 logs hosting-platform
tail -f /var/log/nginx/error.log
```

---

## Common Commands

### Restart Application
```bash
pm2 restart hosting-platform
pm2 restart all
```

### Stop Application
```bash
pm2 stop hosting-platform
pm2 stop all
```

### View All Processes
```bash
pm2 list
pm2 monit  # Real-time monitoring
```

### View Full Logs
```bash
pm2 logs hosting-platform
pm2 logs hosting-platform --lines 100
```

### Save Process List
```bash
pm2 save
```

---

## Troubleshooting

### App Won't Start
```bash
pm2 logs hosting-platform
# Check error message
npm run build  # Rebuild
pm2 restart hosting-platform
```

### Nginx 502 Bad Gateway
```bash
# Check if Node is running
pm2 status
# Restart Node
pm2 restart hosting-platform
# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates
# Renew if needed
sudo certbot renew
```

### MongoDB Connection Issues
```bash
# Test MongoDB connection
mongosh --uri "your_mongodb_uri"
# Or check local MongoDB
systemctl status mongod
```

### Email Not Sending
```bash
# Test SMTP credentials
# Verify .env has correct settings
# Check logs for errors
pm2 logs hosting-platform | grep -i email
```

### High CPU/Memory Usage
```bash
# Check resource usage
pm2 monit
# Kill zombie processes
pm2 kill
pm2 start npm --name "hosting-platform" -- start
```

---

## Monitoring & Maintenance

### Daily Tasks
- [ ] Check error logs: `pm2 logs hosting-platform`
- [ ] Monitor resources: `pm2 monit`
- [ ] Verify HTTPS: `curl -I https://yourdomain.com`

### Weekly Tasks
- [ ] Backup database
- [ ] Check Stripe transactions
- [ ] Review customer orders
- [ ] Update content as needed

### Monthly Tasks
- [ ] Review security logs
- [ ] Update Node.js: `sudo apt upgrade nodejs`
- [ ] Update npm packages: `npm update`
- [ ] SSL certificate status: `sudo certbot certificates`
- [ ] Database optimization

### Quarterly Tasks
- [ ] Full system update: `sudo apt upgrade -y`
- [ ] Review and update .env settings
- [ ] Test disaster recovery (backup restoration)

---

## Performance Optimization

### Enable Caching
```bash
# In .env
NEXT_CACHE=true
NODE_ENV=production
```

### Optimize Images
- Use next/image component
- Set proper dimensions
- Enable automatic optimization

### Database Indexing
```bash
# In MongoDB
db.users.createIndex({ email: 1 })
db.orders.createIndex({ user_id: 1 })
db.services.createIndex({ slug: 1 })
```

### CDN Setup (Optional)
- Use Cloudflare for DNS
- Cache static assets
- Enable WAF for security

---

## Backup & Recovery

### Backup Database
```bash
# MongoDB
mongodump --uri="your_uri" --out=./backup-$(date +%Y%m%d)

# Or use MongoDB Atlas auto-backups
```

### Backup Application Files
```bash
cd ~/apps
tar -czf hosting-platform-$(date +%Y%m%d).tar.gz hosting-platform/
```

### Restore from Backup
```bash
# Stop application
pm2 stop hosting-platform

# Restore files
tar -xzf hosting-platform-20250115.tar.gz

# Restore database
mongorestore --uri="your_uri" ./backup-20250115

# Restart
pm2 start hosting-platform
```

---

## Security Checklist

- [ ] Change default root password
- [ ] Configure UFW firewall
- [ ] Enable SSH key authentication
- [ ] Disable password SSH login
- [ ] Install fail2ban
- [ ] Setup log rotation
- [ ] Enable automatic security updates
- [ ] Configure backup encryption
- [ ] Review user permissions
- [ ] Setup DDoS protection (Cloudflare)

### Setup Firewall
```bash
sudo ufw enable
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw status
```

### Install Fail2Ban
```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## Cost Breakdown (Monthly)

| Item | Cost |
|------|------|
| Hostinger VPS | $3.99-29.99 |
| Domain Name | $10-15 |
| MongoDB Atlas | Free (5GB) - $57+ (dedicated) |
| Email Service | Free - $50+ |
| CDN (Optional) | Free - $20+ |
| **Total** | **~$14-115** |

---

## Scaling for More Traffic

### Increase Resources
- Upgrade VPS plan (more CPU/RAM)
- Add more disk space
- Increase database capacity

### Load Balancing
- Setup multiple app servers
- Use Nginx as reverse proxy
- Configure session persistence

### Caching Layer
- Add Redis for caching
- Implement CDN
- Enable database query caching

---

## Getting Help

### Hostinger Support
- Email: support@hostinger.com
- Chat: https://hpanel.hostinger.com/support
- Phone: Available for certain plans

### Node.js/Next.js Community
- Next.js Docs: https://nextjs.org/docs
- Node.js Docs: https://nodejs.org/docs
- Stack Overflow: Tag `next.js` or `node.js`

### Stripe Support
- Documentation: https://stripe.com/docs
- Support: https://support.stripe.com

---

## ✅ Deployment Checklist

- [ ] Hostinger VPS upgraded
- [ ] SSH access verified
- [ ] Node.js installed
- [ ] MongoDB setup (Atlas or local)
- [ ] Application cloned
- [ ] Dependencies installed
- [ ] Build completed successfully
- [ ] PM2 process running
- [ ] Nginx configured
- [ ] SSL certificate installed
- [ ] Domain pointing to VPS
- [ ] .env configured
- [ ] Stripe webhooks added
- [ ] Homepage loads without errors
- [ ] Registration/login working
- [ ] Payment processing working
- [ ] Emails sending correctly
- [ ] Admin panel accessible
- [ ] Database seeded
- [ ] Performance acceptable
- [ ] Security measures in place
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] **🎉 LIVE!**

---

## 🚀 You're Live!

Your Next.js hosting platform is now running on Hostinger VPS with:
- ✅ Node.js runtime
- ✅ HTTPS/SSL
- ✅ Custom domain
- ✅ MongoDB database
- ✅ Stripe payments
- ✅ Email notifications
- ✅ 24/7 uptime

**Monitor regularly and scale as your business grows!**

---

**Version**: 1.0  
**Last Updated**: June 2026  
**Status**: Production Ready ✅
