"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTechnicianStatus = exports.updateUserStatus = exports.updateUserRole = exports.getUserById = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
// GET /api/users  [Admin]
const getAllUsers = async (req, res) => {
    const { role } = req.query;
    const filter = {};
    if (role && typeof role === 'string')
        filter.role = role;
    const users = await User_1.default.find(filter).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: { users } });
};
exports.getAllUsers = getAllUsers;
// GET /api/users/:id  [Admin]
const getUserById = async (req, res) => {
    const user = await User_1.default.findById(req.params.id).select('-password');
    if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
    }
    res.status(200).json({ success: true, data: { user } });
};
exports.getUserById = getUserById;
// PUT /api/users/:id/role  [Admin]
const updateUserRole = async (req, res) => {
    const { role } = req.body;
    const allowedRoles = ['admin', 'technician', 'customer'];
    if (!role || !allowedRoles.includes(role)) {
        res.status(400).json({ success: false, message: 'Invalid role' });
        return;
    }
    const user = await User_1.default.findByIdAndUpdate(req.params.id, { role }, { new: true, runValidators: true }).select('-password');
    if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
    }
    res.status(200).json({ success: true, message: 'User role updated', data: { user } });
};
exports.updateUserRole = updateUserRole;
// PUT /api/users/:id/status  [Admin]
const updateUserStatus = async (req, res) => {
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean') {
        res.status(400).json({ success: false, message: 'isActive must be a boolean' });
        return;
    }
    const user = await User_1.default.findByIdAndUpdate(req.params.id, { isActive }, { new: true }).select('-password');
    if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
    }
    res.status(200).json({
        success: true,
        message: `User ${isActive ? 'activated' : 'deactivated'}`,
        data: { user },
    });
};
exports.updateUserStatus = updateUserStatus;
// PUT /api/users/technician/status  [Technician]
const updateTechnicianStatus = async (req, res) => {
    const { technicianStatus } = req.body;
    const allowed = ['available', 'busy', 'offline'];
    if (!technicianStatus || !allowed.includes(technicianStatus)) {
        res.status(400).json({ success: false, message: 'Invalid technician status' });
        return;
    }
    const user = await User_1.default.findByIdAndUpdate(req.user?.userId, { technicianStatus }, { new: true }).select('-password');
    res.status(200).json({
        success: true,
        message: 'Availability updated',
        data: { user },
    });
};
exports.updateTechnicianStatus = updateTechnicianStatus;
//# sourceMappingURL=userController.js.map