import bcrypt from 'bcryptjs';
import { IS_MOCK_MODE } from '../config/db';
import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(__dirname, '../../mock_db.json');

// Initial Data
const initialData = {
  users: [] as any[],
  services: [
    {
      _id: 'mock_s1',
      title: 'CCTV Installation (4 Cameras)',
      description: 'Complete setup of 4 HD cameras with 1TB DVR and cabling.',
      price: 14999,
      category: 'CCTV',
      isActive: true,
      image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=500',
    },
    {
      _id: 'mock_s2',
      title: 'Smart Home Security Kit',
      description: 'Wireless sensors, siren, and mobile app integration.',
      price: 8999,
      category: 'Smart Security',
      isActive: true,
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=500',
    },
    {
      _id: 'mock_s3',
      title: 'Network Rack Setup',
      description: 'Professional networking rack installation and patching.',
      price: 5999,
      category: 'Networking',
      isActive: true,
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500',
    },
  ] as any[],
  orders: [] as any[],
  notifications: [] as any[],
  leaves: [] as any[],
  tracking: {} as Record<string, any>,
};

// Load data from file or use initial
const loadData = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(data);
      // Merge with initialData to ensure all required keys exist
      return { ...initialData, ...parsed };
    }
  } catch (err) {
    console.error('Error loading mock DB:', err);
  }
  return { ...initialData };
};

export const mockData = loadData();

// Save data to file
export const saveMockData = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(mockData, null, 2));
  } catch (err) {
    console.error('Error saving mock DB:', err);
  }
};

// Seed default users
const seedUsers = async () => {
  const salt = await bcrypt.genSalt(10);
  const commonPass = await bcrypt.hash('Admin@123', salt);
  const techPass = await bcrypt.hash('Tech@123', salt);
  const customerPass = await bcrypt.hash('Customer@123', salt);
  
  const defaultUsers = [
    {
      _id: 'mock_admin',
      name: 'Admin SK',
      email: 'admin@sktechnology.com',
      password: commonPass,
      phone: '9876543210',
      role: 'admin',
      isActive: true,
    },
    {
      _id: 'mock_tech',
      name: 'Praveen Technician',
      email: 'tech@sktechnology.com',
      password: techPass,
      phone: '9988776655',
      role: 'technician',
      isActive: true,
    },
    {
      _id: 'mock_customer',
      name: 'Rajesh Customer',
      email: 'customer@sktechnology.com',
      password: customerPass,
      phone: '8877665544',
      role: 'customer',
      isActive: true,
    }
  ];

  defaultUsers.forEach(user => {
    const index = mockData.users.findIndex((u: any) => u.email === user.email);
    if (index > -1) {
      mockData.users[index] = user;
    } else {
      mockData.users.push(user);
    }
  });

  saveMockData();
};

const seedLeaves = () => {
  if (mockData.leaves && mockData.leaves.length > 0) return;
  
  mockData.leaves = [
    {
      _id: 'mock_l1',
      technicianId: 'mock_tech',
      reason: 'FAMILY FUNCTION IN NATIVE',
      startDate: new Date('2026-05-10'),
      endDate: new Date('2026-05-12'),
      status: 'pending',
      createdAt: new Date()
    },
    {
      _id: 'mock_l2',
      technicianId: 'mock_tech',
      reason: 'SICK LEAVE - FEVER',
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-05-02'),
      status: 'approved',
      createdAt: new Date('2026-04-30')
    }
  ];
  saveMockData();
};

const seedTracking = () => {
  if (Object.keys(mockData.tracking).length > 0) return;
  
  mockData.tracking['mock_tech'] = {
    technicianId: 'mock_tech',
    latitude: 12.9716,
    longitude: 77.5946,
    updatedAt: new Date()
  };
  saveMockData();
};

seedUsers();
seedLeaves();
seedTracking();

export const isDbConnected = () => {
  return !IS_MOCK_MODE;
};
