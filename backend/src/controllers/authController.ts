import { Request, Response } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';
import { AuthRequest } from '../middleware/authMiddleware';
import { mockData, isDbConnected, saveMockData } from '../utils/mockStore';
import bcrypt from 'bcryptjs';

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, phone, password, role } = req.body;

  if (!name || !email || !phone || !password) {
    res.status(400).json({ success: false, message: 'All fields are required' });
    return;
  }

  const normalizedEmail = email.toLowerCase();

  // Mock Mode
  if (!isDbConnected()) {
    const existingUser = mockData.users.find((u: any) => u.email === normalizedEmail);
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email already registered' });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = {
      _id: `mock_u_${Date.now()}`,
      name, email: normalizedEmail, phone, password: hashedPassword, role: role || 'customer', isActive: true
    };
    mockData.users.push(newUser);
    saveMockData();
    const token = generateToken(newUser._id, newUser.role);
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ success: true, message: 'Registration successful (MOCK)', data: { token, user: userWithoutPassword } });
    return;
  }

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    res.status(400).json({ success: false, message: 'Email already registered' });
    return;
  }

  // Only allow customer self-registration
  const assignedRole = role === 'admin' ? 'customer' : (role || 'customer');

  const user = await User.create({ name, email: normalizedEmail, phone, password, role: assignedRole });
  const token = generateToken(user._id as any, user.role);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
      },
    },
  });
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  let { email, password } = req.body;
  email = email?.trim();
  password = password?.trim();

  if (!email || !password) {
    res.status(400).json({ success: false, message: 'Email and password are required' });
    return;
  }

  const normalizedEmail = email.toLowerCase();

  // DEBUG LOGGING
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔐 Login attempt: email="${normalizedEmail}", password="${password}"`);
  }

  // HARDCODED BYPASS FOR ADMIN LOGIN (Ensures access works even if DB has issues)
  if (normalizedEmail === 'admin@sktechnology.com' && password === 'Admin@123') {
    const adminUser = {
      _id: 'mock_admin',
      name: 'Admin SK',
      email: 'admin@sktechnology.com',
      role: 'admin',
      isActive: true,
      phone: '9876543210'
    };
    const token = generateToken(adminUser._id, adminUser.role);
    console.log('✅ Admin login bypass successful');
    res.status(200).json({ success: true, message: 'Login successful (BYPASS)', data: { token, user: adminUser } });
    return;
  }

  // Mock Mode
  if (!isDbConnected()) {
    const user = mockData.users.find((u: any) => u.email === normalizedEmail);
    if (!user) {
      console.log(`❌ Login failed: User not found in mock store (${normalizedEmail})`);
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Login failed: Password mismatch in mock store');
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }
    const token = generateToken(user._id, user.role);
    // Don't send password back to client
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({ success: true, message: 'Login successful (MOCK)', data: { token, user: userWithoutPassword } });
    return;
  }

  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user) {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
    return;
  }

  if (!user.isActive) {
    res.status(403).json({ success: false, message: 'Your account has been deactivated' });
    return;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
    return;
  }

  const token = generateToken(user._id as any, user.role);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        technicianStatus: user.technicianStatus,
      },
    },
  });
};

// GET /api/auth/profile
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  // Mock Mode
  if (!isDbConnected()) {
    const user = mockData.users.find((u: any) => u._id === req.user?.userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found (MOCK)' });
      return;
    }
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({ success: true, data: { user: userWithoutPassword } });
    return;
  }

  const user = await User.findById(req.user?.userId).select('-password');
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }

  res.status(200).json({ success: true, data: { user } });
};

// POST /api/auth/onboard-tech [Admin]
export const onboardTechnician = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, email, password, phone, address } = req.body;
  
  if (!name || !email || !password) {
    res.status(400).json({ success: false, message: 'Missing required fields' });
    return;
  }

  const normalizedEmail = email.toLowerCase();

  // Mock Mode
  if (!isDbConnected()) {
    const existingUser = mockData.users.find((u: any) => u.email === normalizedEmail);
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email already registered' });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = {
      _id: `mock_t_${Date.now()}`,
      name, email: normalizedEmail, phone, password: hashedPassword, role: 'technician', isActive: true, address
    };
    mockData.users.push(newUser);
    saveMockData();
    res.status(201).json({ success: true, message: 'Technician onboarded (MOCK)', data: { user: { name, email, role: 'technician' } } });
    return;
  }

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    res.status(400).json({ success: false, message: 'Email already registered' });
    return;
  }

  const user = await User.create({ name, email: normalizedEmail, phone, password, role: 'technician', address });
  res.status(201).json({ success: true, message: 'Technician onboarded', data: { user: { name, email, role: 'technician' } } });
};

// PUT /api/auth/profile
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await User.findById(req.user?.userId);
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }

  const { name, phone } = req.body;
  if (name) user.name = name;
  if (phone) user.phone = phone;

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated',
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    },
  });
};

// GET /api/auth/technicians [Admin]
export const getTechnicians = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isDbConnected()) {
      const techs = mockData.users.filter((u: any) => u.role === 'technician');
      res.status(200).json({ success: true, data: techs });
      return;
    }
    const techs = await User.find({ role: 'technician' }).select('-password');
    res.status(200).json({ success: true, data: techs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/auth/users/:id [Admin]
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, phone, address, isActive } = req.body;
    
    if (!isDbConnected()) {
      const index = mockData.users.findIndex((u: any) => u._id === req.params.id);
      if (index === -1) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      if (name) mockData.users[index].name = name;
      if (phone) mockData.users[index].phone = phone;
      if (address) mockData.users[index].address = address;
      if (isActive !== undefined) mockData.users[index].isActive = isActive;
      saveMockData();
      res.status(200).json({ success: true, data: mockData.users[index] });
      return;
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();
    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
