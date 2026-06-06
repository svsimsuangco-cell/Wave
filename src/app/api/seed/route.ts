import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Service from '@/models/Service';
import Plan from '@/models/Plan';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

async function runSeed() {
  try {
    await dbConnect();

    // Clear existing data
    await Service.deleteMany({});
    await Plan.deleteMany({});
    await Admin.deleteMany({});

    // Create services with better descriptions
    const servicesData = [
      {
        name: 'Web Hosting',
        slug: 'web-hosting',
        description: 'Fast, reliable, and secure web hosting for your website. Perfect for blogs, e-commerce, and small business websites.',
        order: 1,
      },
      {
        name: 'Cloud Servers',
        slug: 'cloud-servers',
        description: 'Scalable cloud infrastructure for modern applications. Auto-scaling, flexible resources, and high availability.',
        order: 2,
      },
      {
        name: 'Dedicated Servers',
        slug: 'dedicated-servers',
        description: 'Full power of a dedicated server for high-demand workloads. Complete control and maximum performance.',
        order: 3,
      },
      {
        name: 'Virtual Private Servers',
        slug: 'vps',
        description: 'Flexible VPS with dedicated resources and root access. The perfect balance between shared and dedicated.',
        order: 4,
      },
    ];

    const createdServices = await Service.insertMany(servicesData);

    // Create comprehensive plans for each service
    const plansData = [
      // Web Hosting Plans
      {
        serviceId: createdServices[0]._id.toString(),
        name: 'Starter',
        description: 'Perfect for small websites and blogs',
        basePricePerMonth: 2.99,
        vCPU: 1,
        RAM: 0.5,
        storage: 25,
        bandwidth: 'Unlimited',
        features: ['1 Website', '5 Email Accounts', 'Free SSL', 'Daily Backups', 'cPanel Control Panel'],
        order: 1,
      },
      {
        serviceId: createdServices[0]._id.toString(),
        name: 'Professional',
        description: 'Great for growing business websites',
        basePricePerMonth: 7.99,
        vCPU: 2,
        RAM: 2,
        storage: 100,
        bandwidth: 'Unlimited',
        features: ['10 Websites', 'Unlimited Emails', 'Free SSL', 'Hourly Backups', 'cPanel, Free Migration'],
        order: 2,
      },
      {
        serviceId: createdServices[0]._id.toString(),
        name: 'Business',
        description: 'For established business websites',
        basePricePerMonth: 14.99,
        vCPU: 4,
        RAM: 4,
        storage: 250,
        bandwidth: 'Unlimited',
        features: ['Unlimited Websites', 'Unlimited Emails', 'Free SSL', 'Real-time Backups', 'Priority Support'],
        order: 3,
      },

      // Cloud Servers Plans
      {
        serviceId: createdServices[1]._id.toString(),
        name: 'Starter',
        description: 'For small applications and development',
        basePricePerMonth: 9.99,
        vCPU: 1,
        RAM: 1,
        storage: 30,
        bandwidth: 'Unlimited',
        features: ['1 vCPU', '1GB RAM', 'Auto Backups', 'DDoS Protection', 'Free Migration'],
        order: 1,
      },
      {
        serviceId: createdServices[1]._id.toString(),
        name: 'Growth',
        description: 'For growing applications and APIs',
        basePricePerMonth: 29.99,
        vCPU: 4,
        RAM: 8,
        storage: 150,
        bandwidth: 'Unlimited',
        features: ['4 vCPU', '8GB RAM', 'Auto Backups', 'DDoS Protection', 'Load Balancing', 'Priority Support'],
        order: 2,
      },
      {
        serviceId: createdServices[1]._id.toString(),
        name: 'Enterprise',
        description: 'For high-traffic applications',
        basePricePerMonth: 79.99,
        vCPU: 8,
        RAM: 32,
        storage: 500,
        bandwidth: 'Unlimited',
        features: ['8 vCPU', '32GB RAM', '500GB SSD', 'Auto Backups', 'DDoS Protection', 'Managed Services'],
        order: 3,
      },

      // Dedicated Servers Plans
      {
        serviceId: createdServices[2]._id.toString(),
        name: 'Performance',
        description: 'Entry-level dedicated server',
        basePricePerMonth: 79.99,
        vCPU: 4,
        RAM: 16,
        storage: 500,
        bandwidth: 'Unlimited',
        features: ['Intel Xeon CPU', '16GB RAM', 'RAID-1 Storage', 'Dedicated IP', '24/7 Support'],
        order: 1,
      },
      {
        serviceId: createdServices[2]._id.toString(),
        name: 'Power',
        description: 'Mid-range dedicated server',
        basePricePerMonth: 149.99,
        vCPU: 8,
        RAM: 32,
        storage: 1000,
        bandwidth: 'Unlimited',
        features: ['Intel Xeon CPU', '32GB RAM', 'RAID-10 Storage', 'Multiple IPs', 'Managed Services'],
        order: 2,
      },
      {
        serviceId: createdServices[2]._id.toString(),
        name: 'Extreme',
        description: 'High-performance dedicated server',
        basePricePerMonth: 299.99,
        vCPU: 16,
        RAM: 64,
        storage: 2000,
        bandwidth: 'Unlimited',
        features: ['Intel Xeon CPU', '64GB RAM', 'RAID-10 NVMe', 'Multiple IPs', 'Premium Support', 'Firewall'],
        order: 3,
      },

      // VPS Plans
      {
        serviceId: createdServices[3]._id.toString(),
        name: 'Starter',
        description: 'VPS for small projects',
        basePricePerMonth: 6.99,
        vCPU: 1,
        RAM: 2,
        storage: 50,
        bandwidth: 'Unlimited',
        features: ['1 vCPU', '2GB RAM', '50GB SSD', 'Full Root Access', 'DDoS Protection'],
        order: 1,
      },
      {
        serviceId: createdServices[3]._id.toString(),
        name: 'Professional',
        description: 'VPS for growing projects',
        basePricePerMonth: 16.99,
        vCPU: 2,
        RAM: 8,
        storage: 150,
        bandwidth: 'Unlimited',
        features: ['2 vCPU', '8GB RAM', '150GB SSD', 'Full Root Access', 'Priority Support', 'Free Migration'],
        order: 2,
      },
      {
        serviceId: createdServices[3]._id.toString(),
        name: 'Business',
        description: 'VPS for demanding workloads',
        basePricePerMonth: 39.99,
        vCPU: 4,
        RAM: 16,
        storage: 400,
        bandwidth: 'Unlimited',
        features: ['4 vCPU', '16GB RAM', '400GB SSD', 'Root Access', 'Dedicated IP', 'Managed Services'],
        order: 3,
      },
    ];

    const insertedPlans = await Plan.insertMany(plansData);

    // Create default admin account
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminData = {
      email: 'admin@hosting.com',
      password: hashedPassword,
      name: 'System Administrator',
      role: 'super_admin',
      permissions: [
        'view_dashboard',
        'manage_services',
        'manage_plans',
        'view_orders',
        'manage_orders',
        'view_customers',
        'manage_admins',
      ],
    };

    const createdAdmin = await Admin.create(adminData);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Database seeded successfully!',
        data: {
          servicesCreated: createdServices.length,
          plansCreated: insertedPlans.length,
          adminCreated: true,
          adminEmail: 'admin@hosting.com',
          adminPassword: 'admin123 (CHANGE THIS!)',
        }
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Support both GET and POST requests
export async function GET() {
  return runSeed();
}

export async function POST() {
  return runSeed();
}
