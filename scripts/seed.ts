import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hosting-platform';

// Models
interface IService {
  name: string;
  description: string;
  icon?: string;
}

interface IPlan {
  serviceId: string;
  name: string;
  monthlyPrice: number;
  vCpus: number;
  ram: number;
  storage: number;
  bandwidth: string;
  description: string;
}

interface IAdmin {
  email: string;
  password: string;
  name: string;
  role: string;
  permissions: string[];
}

async function seed() {
  try {
    console.log('🌱 Starting database seed...\n');
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection failed');
    }

    // Create collections if they don't exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    // Clear existing data
    if (collectionNames.includes('services')) {
      await db.collection('services').deleteMany({});
      console.log('🧹 Cleared services collection');
    }
    if (collectionNames.includes('plans')) {
      await db.collection('plans').deleteMany({});
      console.log('🧹 Cleared plans collection');
    }
    if (collectionNames.includes('admins')) {
      const existingAdmins = await db.collection('admins').countDocuments();
      if (existingAdmins > 0) {
        await db.collection('admins').deleteMany({});
        console.log('🧹 Cleared admins collection');
      }
    }

    // Insert Services
    const servicesCollection = db.collection('services');
    
    // Helper function to generate slug
    const generateSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-');
    
    const services: IService[] = [
      {
        name: 'Web Hosting',
        slug: 'web-hosting',
        description: 'Fast & reliable web hosting for websites and blogs',
        icon: '🌐',
        order: 0,
      },
      {
        name: 'Cloud Servers',
        slug: 'cloud-servers',
        description: 'Scalable cloud infrastructure with automatic backups',
        icon: '☁️',
        order: 1,
      },
      {
        name: 'VPS',
        slug: 'vps',
        description: 'Virtual private servers with root access',
        icon: '🖥️',
        order: 2,
      },
      {
        name: 'Dedicated Servers',
        slug: 'dedicated-servers',
        description: 'High performance dedicated servers for demanding applications',
        icon: '⚡',
        order: 3,
      },
    ];

    const insertedServices = await servicesCollection.insertMany(services);
    const serviceIds = Object.values(insertedServices.insertedIds);
    console.log('✅ Inserted 4 services');

    // Insert Plans
    const plansCollection = db.collection('plans');
    const plans: IPlan[] = [
      // Web Hosting Plans
      {
        serviceId: serviceIds[0].toString(),
        name: 'Starter',
        monthlyPrice: 9.99,
        vCpus: 1,
        ram: 2,
        storage: 50,
        bandwidth: 'Unlimited',
        description: 'Perfect for beginners and small websites',
      },
      {
        serviceId: serviceIds[0].toString(),
        name: 'Professional',
        monthlyPrice: 19.99,
        vCpus: 2,
        ram: 4,
        storage: 100,
        bandwidth: 'Unlimited',
        description: 'Great for growing websites and businesses',
      },
      {
        serviceId: serviceIds[0].toString(),
        name: 'Business',
        monthlyPrice: 29.99,
        vCpus: 4,
        ram: 8,
        storage: 250,
        bandwidth: 'Unlimited',
        description: 'For established businesses needing more resources',
      },

      // Cloud Servers Plans
      {
        serviceId: serviceIds[1].toString(),
        name: 'Basic',
        monthlyPrice: 15.99,
        vCpus: 2,
        ram: 4,
        storage: 100,
        bandwidth: 'Unlimited',
        description: 'Entry-level cloud server with great performance',
      },
      {
        serviceId: serviceIds[1].toString(),
        name: 'Advanced',
        monthlyPrice: 39.99,
        vCpus: 4,
        ram: 8,
        storage: 250,
        bandwidth: 'Unlimited',
        description: 'Advanced cloud infrastructure for scaling applications',
      },
      {
        serviceId: serviceIds[1].toString(),
        name: 'Enterprise',
        monthlyPrice: 79.99,
        vCpus: 8,
        ram: 16,
        storage: 500,
        bandwidth: 'Unlimited',
        description: 'Enterprise-grade cloud server with maximum performance',
      },

      // VPS Plans
      {
        serviceId: serviceIds[2].toString(),
        name: 'Mini',
        monthlyPrice: 6.99,
        vCpus: 1,
        ram: 2,
        storage: 50,
        bandwidth: '2TB',
        description: 'Affordable VPS for small projects',
      },
      {
        serviceId: serviceIds[2].toString(),
        name: 'Standard',
        monthlyPrice: 14.99,
        vCpus: 2,
        ram: 4,
        storage: 100,
        bandwidth: 'Unlimited',
        description: 'Popular VPS with balanced resources',
      },
      {
        serviceId: serviceIds[2].toString(),
        name: 'Premium',
        monthlyPrice: 24.99,
        vCpus: 4,
        ram: 8,
        storage: 200,
        bandwidth: 'Unlimited',
        description: 'Premium VPS for resource-intensive applications',
      },

      // Dedicated Servers Plans
      {
        serviceId: serviceIds[3].toString(),
        name: 'Power',
        monthlyPrice: 49.99,
        vCpus: 4,
        ram: 16,
        storage: 500,
        bandwidth: 'Unlimited',
        description: 'Powerful dedicated server for high-traffic sites',
      },
      {
        serviceId: serviceIds[3].toString(),
        name: 'Ultra',
        monthlyPrice: 99.99,
        vCpus: 8,
        ram: 32,
        storage: 1000,
        bandwidth: 'Unlimited',
        description: 'Ultra-high performance dedicated server',
      },
      {
        serviceId: serviceIds[3].toString(),
        name: 'Maximum',
        monthlyPrice: 149.99,
        vCpus: 16,
        ram: 64,
        storage: 2000,
        bandwidth: 'Unlimited',
        description: 'Maximum performance for enterprise applications',
      },
    ];

    await plansCollection.insertMany(plans);
    console.log('✅ Inserted 12 pricing plans');

    // Insert Default Admin Account
    const adminsCollection = db.collection('admins');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const defaultAdmin: IAdmin = {
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

    await adminsCollection.insertOne(defaultAdmin);
    console.log('✅ Created default admin account');

    console.log('\n✨ Database seeding completed successfully!\n');
    console.log('📌 Default Admin Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   📧 Email:    admin@hosting.com');
    console.log('   🔑 Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Change the admin password after first login!\n');
    console.log('📚 Database Contents:');
    console.log('   • 4 Services (Web Hosting, Cloud Servers, VPS, Dedicated)');
    console.log('   • 12 Pricing Plans');
    console.log('   • 1 Admin Account\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
