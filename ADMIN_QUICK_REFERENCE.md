# Admin Panel - Quick Reference

## 🔐 Access Admin Panel

1. Go to: `http://localhost:3000/admin/login`
2. Login with your admin credentials
3. You're in the dashboard!

---

## 📍 Admin Navigation

```
Dashboard (/admin/dashboard)
├─ View Orders → Orders List
│              └─ Click "View" → Order Details
├─ Manage Services → Services List
├─ Manage Plans → Plans List
└─ Logout
```

---

## 📊 Dashboard Stats

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   Total Orders    Total Customers   Revenue   Services
│      12                 8            $1,234.56    4
│                                                  │
├──────────────────────────────────────────────────┤
│ Manage Services | Manage Plans | View Orders   │
└──────────────────────────────────────────────────┘
```

---

## 📋 View All Orders

**URL:** `http://localhost:3000/admin/orders`

**What You See:**
| Order ID | Customer | Email | Items | Amount | Status | Date | Action |
|----------|----------|-------|-------|--------|--------|------|--------|
| ORD-123 | John Doe | john@test.com | 1 | $9.99 | Pending | 6/3 | View |

**Features:**
- Filter by status: All / Pending / Completed / Failed / Cancelled
- Pagination (20 orders per page)
- Click "View" to see full details

---

## 👁️ View Order Details

**URL:** `http://localhost:3000/admin/orders/[order_id]`

**Left Side - Order Info:**
```
Order Status
[Pending] [Completed] [Failed] [Cancelled]

Services Ordered
├─ Plan Name
│  ├─ Description
│  ├─ Quantity: 1
│  └─ $9.99/month
└─ Total: $9.99
```

**Right Side - Customer Info:**
```
Customer Information
├─ Name: John Doe
└─ Email: john@test.com

Billing Address
├─ 123 Main St
├─ New York, USA
└─ 10001

Order Information
├─ Order #: ORD-123
├─ Date: 6/3/2026
├─ Updated: 6/3/2026
└─ Payment ID: pi_xxx
```

---

## ⚙️ Manage Services

**URL:** `http://localhost:3000/admin/services`

**Add Service:**
```
[+ Add Service] Button

Form:
├─ Service Name: "Web Hosting"
├─ Description: "Fast & reliable web hosting"
└─ [Add Service] Button
```

**View Services:**
```
All Services
├─ Web Hosting - "Fast & reliable web hosting" [Delete]
├─ Cloud Servers - "Scalable cloud infrastructure" [Delete]
└─ VPS - "Virtual private servers" [Delete]
```

---

## 💰 Manage Plans

**URL:** `http://localhost:3000/admin/plans`

**Add Plan:**
```
[+ Add Plan] Button

Form:
├─ Service: [Dropdown]
├─ Plan Name: "Starter"
├─ Price: 9.99
├─ vCPU: 1
├─ RAM: 2
├─ Storage: 50
├─ Bandwidth: "Unlimited"
├─ Description: "Perfect for beginners"
└─ [Add Plan] Button
```

**View Plans:**
```
All Plans
┌─────────────────────────────────────────────────────┐
│ Service | Name | Price | vCPU | RAM | Storage | Del│
├─────────────────────────────────────────────────────┤
│ Web     | Start│ 9.99  │  1   │ 2GB │  50GB  │[X]│
│ Web     │ Pro  │19.99  │  2   │ 4GB │ 100GB  │[X]│
└─────────────────────────────────────────────────────┘
```

---

## 🎯 Common Tasks

### Change Order Status
1. Go to Orders list
2. Click "View" on the order
3. Click the new status button
4. Status updates immediately

### Add New Service
1. Go to Services management
2. Click "+ Add Service"
3. Enter name and description
4. Click "Add Service"
5. Service appears in list

### Add New Pricing Plan
1. Go to Plans management
2. Click "+ Add Plan"
3. Select service
4. Fill in all details
5. Click "Add Plan"
6. Plan appears in table

### Delete Service/Plan
1. Find it in the list
2. Click "Delete" button
3. Confirm deletion
4. It's removed

---

## 🔄 Order Status Flow

```
Pending (waiting for activation)
   ↓
Completed (active/running)
   ↓
Failed (payment failed)
   ↓
Cancelled (user cancelled)
```

**You can change to any status at any time!**

---

## 📈 Statistics Explained

**Total Orders:** How many orders have been placed
**Total Customers:** How many unique customers
**Total Revenue:** Sum of all order amounts
**Active Services:** How many services are available

---

## ⚡ Quick Links

| Page | URL |
|------|-----|
| Dashboard | /admin/dashboard |
| Orders List | /admin/orders |
| Services | /admin/services |
| Plans | /admin/plans |

---

## 🚨 Important Notes

- **Status changes are immediate** - No confirmation needed
- **Deletions require confirmation** - "Are you sure?"
- **All data persists** - Changes saved to database
- **Pagination works** - 20 items per page
- **Filters work** - Click status to filter orders
- **Logout button** - Red button in top right

---

## 🆘 Troubleshooting

**Orders not showing?**
- Check if data was seeded: `curl -X POST http://localhost:3000/api/seed`
- Refresh the page

**Can't change status?**
- Check if order ID is correct
- Try refreshing and try again

**Can't add service/plan?**
- Check all required fields filled
- Make sure service is selected (for plans)
- Check browser console for errors

---

**Status: ✅ READY TO USE**

Your admin panel is fully operational!
