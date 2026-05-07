import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Service from '../models/Service';
import bcrypt from 'bcryptjs';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('🌱 Connected to MongoDB');

    // Clear existing
    await User.deleteMany({});
    await Service.deleteMany({});

    // Create Admin
    const salt = await bcrypt.genSalt(12);
    const adminPassword = await bcrypt.hash('Admin@123', salt);
    await User.create({
      name: 'Admin SK',
      email: 'admin@sktechnology.com',
      password: adminPassword,
      phone: '9876543210',
      role: 'admin',
      isActive: true,
    });
    console.log('✅ Admin Created: admin@sktechnology.com / Admin@123');

    // Create Technician
    const techPassword = await bcrypt.hash('Tech@123', salt);
    await User.create({
      name: 'John Technician',
      email: 'tech@sktechnology.com',
      password: techPassword,
      phone: '9876543211',
      role: 'technician',
      isActive: true,
      technicianStatus: 'available',
    });
    console.log('✅ Tech Created: tech@sktechnology.com / Tech@123');

    // Create Services
    const services = [
      {
        title: 'CCTV Installation (4 Cameras)',
        description: 'Complete setup of 4 HD cameras with 1TB DVR and cabling.',
        price: 14999,
        category: 'CCTV',
        isActive: true,
      },
      {
        title: 'Smart Home Security Kit',
        description: 'Wireless sensors, siren, and mobile app integration.',
        price: 8999,
        category: 'Smart Security',
        isActive: true,
      },
      {
        title: 'Network Rack Setup',
        description: 'Professional networking rack installation and patching.',
        price: 5999,
        category: 'Networking',
        isActive: true,
      },
    ];
    await Service.insertMany(services);
    console.log('✅ Services Seeded');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();
