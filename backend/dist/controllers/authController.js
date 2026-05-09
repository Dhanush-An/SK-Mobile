"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getTechnicians = exports.updateProfile = exports.onboardTechnician = exports.getProfile = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
// POST /api/auth/register
const register = async (req, res) => {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !phone || !password) {
        res.status(400).json({ success: false, message: 'All fields are required' });
        return;
    }
    const normalizedEmail = email.toLowerCase();
    const existingUser = await User_1.default.findOne({ email: normalizedEmail });
    if (existingUser) {
        res.status(400).json({ success: false, message: 'Email already registered' });
        return;
    }
    // Only allow customer self-registration
    const assignedRole = role === 'admin' ? 'customer' : (role || 'customer');
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
    // DEBUG LOGGING
    if (process.env.NODE_ENV === 'development') {
        console.log(`🔐 Login attempt: email="${normalizedEmail}", password="${password}"`);
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
// POST /api/auth/onboard-tech [Admin]
const onboardTechnician = async (req, res) => {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password) {
        res.status(400).json({ success: false, message: 'Missing required fields' });
        return;
    }
    const normalizedEmail = email.toLowerCase();
    const existingUser = await User_1.default.findOne({ email: normalizedEmail });
    if (existingUser) {
        res.status(400).json({ success: false, message: 'Email already registered' });
        return;
    }
    const user = await User_1.default.create({ name, email: normalizedEmail, phone, password, role: 'technician', address });
    res.status(201).json({ success: true, message: 'Technician onboarded', data: { user: { name, email, role: 'technician' } } });
};
exports.onboardTechnician = onboardTechnician;
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
// GET /api/auth/technicians [Admin]
const getTechnicians = async (req, res) => {
    try {
        const techs = await User_1.default.find({ role: 'technician' }).select('-password');
        res.status(200).json({ success: true, data: techs });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getTechnicians = getTechnicians;
// PUT /api/auth/users/:id [Admin]
const updateUser = async (req, res) => {
    try {
        const { name, phone, address, isActive } = req.body;
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        if (name)
            user.name = name;
        if (phone)
            user.phone = phone;
        if (address)
            user.address = address;
        if (isActive !== undefined)
            user.isActive = isActive;
        await user.save();
        res.status(200).json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateUser = updateUser;
//# sourceMappingURL=authController.js.map