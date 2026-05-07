"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const mockStore_1 = require("../utils/mockStore");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// POST /api/auth/register
const register = async (req, res) => {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !phone || !password) {
        res.status(400).json({ success: false, message: 'All fields are required' });
        return;
    }
    const normalizedEmail = email.toLowerCase();
    // Mock Mode
    if (!(0, mockStore_1.isDbConnected)()) {
        const existingUser = mockStore_1.mockData.users.find((u) => u.email === normalizedEmail);
        if (existingUser) {
            res.status(400).json({ success: false, message: 'Email already registered' });
            return;
        }
        const assignedRole = role === 'customer' || !role ? 'customer' : 'customer';
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const newUser = {
            _id: `mock_u_${Date.now()}`,
            name, email: normalizedEmail, phone, password: hashedPassword, role: assignedRole, isActive: true
        };
        mockStore_1.mockData.users.push(newUser);
        (0, mockStore_1.saveMockData)();
        const token = (0, generateToken_1.default)(newUser._id, newUser.role);
        res.status(201).json({ success: true, message: 'Registration successful (MOCK)', data: { token, user: newUser } });
        return;
    }
    const existingUser = await User_1.default.findOne({ email: normalizedEmail });
    if (existingUser) {
        res.status(400).json({ success: false, message: 'Email already registered' });
        return;
    }
    // Only allow customer self-registration; admin/technician created by admin
    const assignedRole = role === 'customer' || !role ? 'customer' : 'customer';
    const user = await User_1.default.create({ name, email: normalizedEmail, phone, password, role: assignedRole });
    const token = (0, generateToken_1.default)(user._id, user.role);
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
exports.register = register;
// POST /api/auth/login
const login = async (req, res) => {
    let { email, password } = req.body;
    email = email?.trim();
    password = password?.trim();
    if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required' });
        return;
    }
    const normalizedEmail = email.toLowerCase();
    // HARDCODED BYPASS FOR ADMIN LOGIN (Ensures access works even if DB has issues)
    if (email.toLowerCase() === 'admin@sktechnology.com' && password === 'Admin@123') {
        const adminUser = {
            _id: 'mock_admin',
            name: 'Admin SK',
            email: 'admin@sktechnology.com',
            role: 'admin',
            isActive: true,
            phone: '9876543210'
        };
        const token = (0, generateToken_1.default)(adminUser._id, adminUser.role);
        res.status(200).json({ success: true, message: 'Login successful (BYPASS)', data: { token, user: adminUser } });
        return;
    }
    // Mock Mode
    if (!(0, mockStore_1.isDbConnected)()) {
        const user = mockStore_1.mockData.users.find((u) => u.email === normalizedEmail);
        if (!user) {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
            return;
        }
        const token = (0, generateToken_1.default)(user._id, user.role);
        res.status(200).json({ success: true, message: 'Login successful (MOCK)', data: { token, user } });
        return;
    }
    const user = await User_1.default.findOne({ email: normalizedEmail }).select('+password');
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
    const token = (0, generateToken_1.default)(user._id, user.role);
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
exports.login = login;
// GET /api/auth/profile
const getProfile = async (req, res) => {
    const user = await User_1.default.findById(req.user?.userId).select('-password');
    if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
    }
    res.status(200).json({ success: true, data: { user } });
};
exports.getProfile = getProfile;
// PUT /api/auth/profile
const updateProfile = async (req, res) => {
    const user = await User_1.default.findById(req.user?.userId);
    if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
    }
    const { name, phone } = req.body;
    if (name)
        user.name = name;
    if (phone)
        user.phone = phone;
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
exports.updateProfile = updateProfile;
//# sourceMappingURL=authController.js.map