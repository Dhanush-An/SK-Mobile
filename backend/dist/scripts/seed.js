"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
const Service_1 = __importDefault(require("../models/Service"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
dotenv_1.default.config();
const seed = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log('🌱 Connected to MongoDB');
        // Clear existing
        await User_1.default.deleteMany({});
        await Service_1.default.deleteMany({});
        // Create Admin
        const salt = await bcryptjs_1.default.genSalt(12);
        const adminPassword = await bcryptjs_1.default.hash('Admin@123', salt);
        await User_1.default.create({
            name: 'Admin SK',
            email: 'admin@sktechnology.com',
            password: adminPassword,
            phone: '9876543210',
            role: 'admin',
            isActive: true,
        });
        console.log('✅ Admin Created: admin@sktechnology.com / Admin@123');
        // Create Technician
        const techPassword = await bcryptjs_1.default.hash('Tech@123', salt);
        await User_1.default.create({
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
        await Service_1.default.insertMany(services);
        console.log('✅ Services Seeded');
        process.exit(0);
    }
    catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
};
seed();
//# sourceMappingURL=seed.js.map