"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDbConnected = exports.saveMockData = exports.mockData = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../config/db");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DB_FILE = path_1.default.join(__dirname, '../../mock_db.json');
// Initial Data
const initialData = {
    users: [],
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
    ],
    orders: [],
};
// Load data from file or use initial
const loadData = () => {
    try {
        if (fs_1.default.existsSync(DB_FILE)) {
            const data = fs_1.default.readFileSync(DB_FILE, 'utf8');
            return JSON.parse(data);
        }
    }
    catch (err) {
        console.error('Error loading mock DB:', err);
    }
    return initialData;
};
exports.mockData = loadData();
// Save data to file
const saveMockData = () => {
    try {
        fs_1.default.writeFileSync(DB_FILE, JSON.stringify(exports.mockData, null, 2));
    }
    catch (err) {
        console.error('Error saving mock DB:', err);
    }
};
exports.saveMockData = saveMockData;
// Seed a default admin
const seedAdmin = async () => {
    const adminEmail = 'admin@sktechnology.com';
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashedPassword = await bcryptjs_1.default.hash('Admin@123', salt);
    const adminIndex = exports.mockData.users.findIndex((u) => u.email === adminEmail);
    const adminUser = {
        _id: 'mock_admin',
        name: 'Admin SK',
        email: adminEmail,
        password: hashedPassword,
        phone: '9876543210',
        role: 'admin',
        isActive: true,
    };
    if (adminIndex > -1) {
        exports.mockData.users[adminIndex] = adminUser;
    }
    else {
        exports.mockData.users.push(adminUser);
    }
    (0, exports.saveMockData)();
};
seedAdmin();
const isDbConnected = () => {
    return !db_1.IS_MOCK_MODE;
};
exports.isDbConnected = isDbConnected;
//# sourceMappingURL=mockStore.js.map