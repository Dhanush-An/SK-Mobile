"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteService = exports.updateService = exports.getServiceById = exports.getServices = exports.createService = void 0;
const Service_1 = __importDefault(require("../models/Service"));
// POST /api/services  [Admin]
const createService = async (req, res) => {
    const { title, description, price, category, image } = req.body;
    if (!title || !description || !price || !category) {
        res.status(400).json({ success: false, message: 'title, description, price and category are required' });
        return;
    }
    const service = await Service_1.default.create({ title, description, price, category, image });
    res.status(201).json({ success: true, message: 'Service created', data: { service } });
};
exports.createService = createService;
// GET /api/services  [Public]
const getServices = async (req, res) => {
    const filter = {};
    // Public sees only active; admin can see all via ?all=true
    if (req.query.all !== 'true')
        filter.isActive = true;
    const services = await Service_1.default.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: { services } });
};
exports.getServices = getServices;
// GET /api/services/:id  [Public]
const getServiceById = async (req, res) => {
    const service = await Service_1.default.findById(req.params.id);
    if (!service) {
        res.status(404).json({ success: false, message: 'Service not found' });
        return;
    }
    res.status(200).json({ success: true, data: { service } });
};
exports.getServiceById = getServiceById;
// PUT /api/services/:id  [Admin]
const updateService = async (req, res) => {
    const service = await Service_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!service) {
        res.status(404).json({ success: false, message: 'Service not found' });
        return;
    }
    res.status(200).json({ success: true, message: 'Service updated', data: { service } });
};
exports.updateService = updateService;
// DELETE /api/services/:id  [Admin]
const deleteService = async (req, res) => {
    const service = await Service_1.default.findByIdAndDelete(req.params.id);
    if (!service) {
        res.status(404).json({ success: false, message: 'Service not found' });
        return;
    }
    res.status(200).json({ success: true, message: 'Service deleted' });
};
exports.deleteService = deleteService;
//# sourceMappingURL=serviceController.js.map