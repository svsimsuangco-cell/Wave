# 🎯 Complete User & Admin Flow Diagram

## 👥 User Journey

```
┌─────────────────────────────────────────────────────────────────────┐
│                        HOME PAGE                                     │
│                  http://localhost:3000                               │
│                                                                       │
│   ┌──────────────────────────────────────────────────────────────┐  │
│   │  Welcome to Hosting Hub!                                     │  │
│   │  Browse Services   View Pricing   Login   Register           │  │
│   └──────────────────────────────────────────────────────────────┘  │
│                          │          │       │      │                │
│                          ▼          ▼       ▼      ▼                │
│                      SERVICES   PRICING   LOGIN  REGISTER           │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────────────────┐
        │            REGISTER NEW ACCOUNT                      │
        │        /auth/register                                │
        │                                                       │
        │ First Name:    [________________]                    │
        │ Last Name:     [________________]                    │
        │ Email:         [________________]                    │
        │ Password:      [________________]                    │
        │ Address:       [________________]                    │
        │ City:          [________________]                    │
        │ Country:       [________________]                    │
        │                                                       │
        │ [Register Button]      [Already have account? Login]  │
        └─────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────────────────┐
        │      API: POST /api/auth/register                    │
        │      ✅ Hash password                                │
        │      ✅ Create user (isVerified: false)              │
        │      ✅ Generate verification token                  │
        │      ✅ Send verification email                      │
        │      ✅ Set 'auth' cookie                            │
        │      ✅ Redirect to /verification-pending            │
        └─────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────────────────┐
        │      EMAIL VERIFICATION PENDING                      │
        │        /verification-pending                         │
        │                                                       │
        │ 📧 Check your email!                                 │
        │ We sent a verification link to:                      │
        │ user@example.com                                     │
        │                                                       │
        │ Click the link in the email to activate your account │
        │                                                       │
        │ [Resend Email]  [Back to Login]                      │
        └─────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │ User clicks email link
                    ▼
        ┌─────────────────────────────────────────────────────┐
        │    API: GET /api/auth/verify?token=xxxxx             │
        │    ✅ Validate token                                 │
        │    ✅ Check expiry (24 hours)                        │
        │    ✅ Set isVerified: true                           │
        │    ✅ Redirect to /verification-success              │
        └─────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────────────────┐
        │      VERIFICATION SUCCESS!                           │
        │      /verification-success                           │
        │                                                       │
        │ ✅ Account Verified!                                 │
        │ Your account is now active.                          │
        │ You can now login and start shopping.                │
        │                                                       │
        │ [Go to Login]                                        │
        └─────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────────────────┐
        │            USER LOGIN                                │
        │        /auth/login                                   │
        │                                                       │
        │ Email:    [________________]                         │
        │ Password: [________________]                         │
        │                                                       │
        │ [Sign In]              [Don't have account? Register]│
        │                         [Go to Admin Panel]           │
        └─────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────────────────┐
        │      API: POST /api/auth/login                       │
        │      ✅ Find user by email                           │
        │      ✅ Verify password (bcrypt)                     │
        │      ✅ Check isVerified (must be true)              │
        │      ✅ Generate JWT token                           │
        │      ✅ Set 'auth' cookie (7 days)                   │
        │      ✅ Redirect to /dashboard                       │
        └─────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────────────────┐
        │            USER DASHBOARD                            │
        │          /dashboard                                  │
        │                                                       │
        │ Welcome, John!                                       │
        │                                                       │
        │ [Browse Services] [Cart] [Orders] [Logout]           │
        │                                                       │
        │ Recent Orders:                                       │
        │ ┌────────────────────────────────────────────────┐   │
        │ │ Order #123 - Web Hosting Starter - $9.99/month │   │
        │ │ Status: Pending                                │   │
        │ └────────────────────────────────────────────────┘   │
        └─────────────────────────────────────────────────────┘
                              │
                   ┌──────────┼──────────┐
                   ▼          ▼          ▼
             SERVICES     PRICING    MY ORDERS
```

---

## 👨‍💼 Admin Journey

```
┌─────────────────────────────────────────────────────────────────────┐
│                        ADMIN LOGIN                                   │
│                  /admin/login                                        │
│                                                                       │
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │  Admin Login                                                     │ │
│ │  Sign in to admin panel                                          │ │
│ │                                                                  │ │
│ │  Email:    [________________]                                   │ │
│ │  Password: [________________]                                   │ │
│ │                                                                  │ │
│ │  [Sign In]    [Don't have account? Register]                   │ │
│ │               [Go to User Portal]                              │ │
│ └──────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────────────────┐
        │      API: POST /api/admin/login                      │
        │      ✅ Find admin by email                          │
        │      ✅ Verify password (bcrypt)                     │
        │      ✅ Generate JWT token                           │
        │      ✅ Set 'admin_auth' cookie (7 days)             │
        │      ✅ Redirect to /admin/dashboard                 │
        └─────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌────────────────────────────────────────────────────────────┐
        │              ADMIN DASHBOARD                               │
        │            /admin/dashboard                                │
        │                                                             │
        │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
        │  │ Orders: 5    │  │ Customers: 3 │  │Revenue: $150 │    │
        │  │              │  │              │  │              │    │
        │  └──────────────┘  └──────────────┘  └──────────────┘    │
        │  ┌──────────────┐                                          │
        │  │ Services: 4  │                                          │
        │  │              │                                          │
        │  └──────────────┘                                          │
        │                                                             │
        │  ┌────────────────────────────────────────────────────┐    │
        │  │ [Services]  [Plans]  [Orders]  [Logout]           │    │
        │  └────────────────────────────────────────────────────┘    │
        │                                                             │
        │  ┌────────────────────────────────────────────────────┐    │
        │  │ RECENT ORDERS TABLE                                │    │
        │  ├────────────────────────────────────────────────────┤    │
        │  │ ID    │ Customer │ Email   │ $ │ Status │ Action  │    │
        │  ├────────────────────────────────────────────────────┤    │
        │  │ORD-1  │ John     │john@... │9$ │Pending │ [View] │    │
        │  │ORD-2  │ Jane     │jane@... │19$│Complet │ [View] │    │
        │  │ORD-3  │ Bob      │bob@... │29$│Pending │ [View] │    │
        │  └────────────────────────────────────────────────────┘    │
        └────────────────────────────────────────────────────────────┘
                        │        │         │
         ┌──────────────┼────────┼─────────┼──────────────┐
         ▼              ▼        ▼         ▼              ▼
      ORDERS        SERVICES   PLANS   UPDATE STATUS   LOGOUT
```

---

## 📋 Orders Management

```
┌──────────────────────────────────────────────────────────────┐
│              ORDERS LIST                                     │
│            /admin/orders                                     │
│                                                              │
│ Filter Options:                                             │
│ [All] [Pending] [Completed] [Failed] [Cancelled]            │
│                                                              │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ ID    │ Customer │ Email │ Items │ $ │ Status │ Action  │  │
│ ├────────────────────────────────────────────────────────┤  │
│ │ORD-1  │ John     │john@  │  1   │$9 │Pending │[VIEW]   │  │
│ │ORD-2  │ Jane     │jane@  │  1   │$19│Complet │[VIEW]   │  │
│ │ORD-3  │ Bob      │bob@   │  2   │$29│Failed  │[VIEW]   │  │
│ │ORD-4  │ Alice    │alice@ │  1   │$49│Pending │[VIEW]   │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ [← Previous]  Page 1 of 5  [Next →]                        │
└──────────────────────────────────────────────────────────────┘
         │                              │
         └──────────────────┬───────────┘
                            ▼
        ┌──────────────────────────────────────────────┐
        │      ORDER DETAIL                             │
        │    /admin/orders/ORD-1                       │
        │                                              │
        │ ┌────────────────────────────────────────┐   │
        │ │ STATUS: [Pending] [Completed]           │   │
        │ │         [Failed]  [Cancelled]           │   │
        │ └────────────────────────────────────────┘   │
        │                                              │
        │ ┌────────────────────────────────────────┐   │
        │ │ CUSTOMER INFO                          │   │
        │ │ Name: John Doe                         │   │
        │ │ Email: john@example.com                │   │
        │ │ Phone: +1-234-567-8900                 │   │
        │ └────────────────────────────────────────┘   │
        │                                              │
        │ ┌────────────────────────────────────────┐   │
        │ │ SERVICES ORDERED                       │   │
        │ │ Plan: Web Hosting - Starter            │   │
        │ │ Price: $9.99/month                     │   │
        │ │ Qty: 1                                 │   │
        │ │ Total: $9.99                           │   │
        │ └────────────────────────────────────────┘   │
        │                                              │
        │ ┌────────────────────────────────────────┐   │
        │ │ BILLING ADDRESS                        │   │
        │ │ 123 Main Street                        │   │
        │ │ New York, USA 10001                    │   │
        │ └────────────────────────────────────────┘   │
        │                                              │
        │ [← Back to Orders]  [Print]  [Export]       │
        └──────────────────────────────────────────────┘
```

---

## 🛠️ Services Management

```
┌──────────────────────────────────────────────────────────────┐
│           SERVICES MANAGEMENT                                │
│         /admin/services                                      │
│                                                              │
│ [+ Add Service]                                              │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐    │
│ │ Web Hosting                              [Delete]    │    │
│ │ Fast & reliable web hosting              [Delete]    │    │
│ │                                                       │    │
│ │ Cloud Servers                            [Delete]    │    │
│ │ Scalable cloud infrastructure            [Delete]    │    │
│ │                                                       │    │
│ │ VPS                                      [Delete]    │    │
│ │ Virtual private servers                  [Delete]    │    │
│ │                                                       │    │
│ │ Dedicated Servers                        [Delete]    │    │
│ │ High performance dedicated servers       [Delete]    │    │
│ └──────────────────────────────────────────────────────┘    │
│                                                              │
│ [← Back to Dashboard]                                        │
└──────────────────────────────────────────────────────────────┘
         │
         └─────────────────────────┐
                                   ▼
        ┌──────────────────────────────────────────────┐
        │      ADD NEW SERVICE                         │
        │                                              │
        │ Service Name:                                │
        │ [________________________________]           │
        │ (e.g., "Email Hosting")                     │
        │                                              │
        │ Description:                                 │
        │ [________________________________]           │
        │ [________________________________]           │
        │ [________________________________]           │
        │ (e.g., "Professional email solutions")      │
        │                                              │
        │ [Add Service]  [Cancel]                      │
        └──────────────────────────────────────────────┘
```

---

## 💰 Plans Management

```
┌──────────────────────────────────────────────────────────────────┐
│              PLANS MANAGEMENT                                    │
│            /admin/plans                                          │
│                                                                  │
│ [+ Add Plan]                                                     │
│                                                                  │
│ ┌────────────────────────────────────────────────────────────┐  │
│ │ Service  │ Name       │ Price │ vCPU │ RAM │ Storage │ Del │  │
│ ├────────────────────────────────────────────────────────────┤  │
│ │ Web      │ Starter    │ $2.99 │  1   │ 0.5GB│  25GB  │[X] │  │
│ │ Web      │ Prof       │ $7.99 │  2   │ 2GB  │ 100GB  │[X] │  │
│ │ Web      │ Business   │$14.99 │  4   │ 4GB  │ 250GB  │[X] │  │
│ │ Cloud    │ Starter    │ $9.99 │  1   │ 1GB  │  30GB  │[X] │  │
│ │ Cloud    │ Growth     │$29.99 │  4   │ 8GB  │ 150GB  │[X] │  │
│ │ ...      │ ...        │ ...   │ ...  │ ...  │ ...    │... │  │
│ └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│ [← Back to Dashboard]                                            │
└──────────────────────────────────────────────────────────────────┘
         │
         └─────────────────────────┐
                                   ▼
        ┌──────────────────────────────────────────────┐
        │      ADD NEW PLAN                            │
        │                                              │
        │ Service:              Plan Name:             │
        │ [Select Service ▼]   [_______________]       │
        │                                              │
        │ Price/Month:         vCPU Cores:            │
        │ [$_______]           [_____]                │
        │                                              │
        │ RAM (GB):            Storage (GB):          │
        │ [_______]            [_______]              │
        │                                              │
        │ Bandwidth:                                   │
        │ [_____________________]  (e.g., "Unlimited")│
        │                                              │
        │ Description:                                 │
        │ [________________________________]           │
        │                                              │
        │ [Add Plan]  [Cancel]                         │
        └──────────────────────────────────────────────┘
```

---

## 🔐 Redirect Summary

| User Action | API Endpoint | Cookie Set | Redirect |
|-------------|--------------|-----------|----------|
| User Register | `/api/auth/register` | `auth` | `/verification-pending` |
| Verify Email | `/api/auth/verify?token=...` | `auth` | `/verification-success` |
| User Login | `/api/auth/login` | `auth` | `/dashboard` |
| User Logout | Delete `auth` | None | `/auth/login` |
| **Admin Register** | `/api/admin/register` | `admin_auth` | `/admin/dashboard` |
| **Admin Login** | `/api/admin/login` | `admin_auth` | `/admin/dashboard` |
| **Admin Logout** | Delete `admin_auth` | None | `/admin/login` |

---

## 🎯 Test Accounts

### Admin (Comes from Seed)
```
Email:    admin@hosting.com
Password: admin123
Role:     super_admin
```

### Regular User
```
Register at: /auth/register
Then verify email
Then login at: /auth/login
```

---

## ✅ All Systems Connected!

**You now have a complete, fully-functional hosting platform!** 🚀
