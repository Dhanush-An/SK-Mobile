# SK Technology — Mobile App

## 🏗️ Project Structure
```
c:\Sk\
├── backend/          # Node.js + Express + TypeScript API
│   └── src/
│       ├── config/          # MongoDB connection
│       ├── controllers/     # auth, user, service, order, payment
│       ├── middleware/       # auth, role, error
│       ├── models/          # User, Service, Order, Payment
│       ├── routes/          # All REST routes
│       ├── scripts/         # seed.ts
│       ├── utils/           # generateToken.ts
│       ├── app.ts
│       └── server.ts
└── frontend/         # React Native CLI + TypeScript
    ├── App.tsx
    └── src/
        ├── api/             # axiosClient + API modules
        ├── components/      # AppButton, AppInput, AppCard, StatusBadge...
        ├── constants/       # colors.ts, roles.ts
        ├── context/         # AuthContext.tsx
        ├── navigation/      # Root, Auth, Admin, Tech, Customer navigators
        ├── screens/         # All 20+ screens
        ├── types/           # TypeScript types
        └── utils/           # storage.ts, validators.ts
```

---

## ⚙️ Environment Variables

### Backend — `c:\Sk\backend\.env`
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/sk_technology
JWT_SECRET=sk_technology_super_secret_jwt_key_2024
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
NODE_ENV=development
```

### Frontend — `c:\Sk\frontend\.env`
```env
API_URL=http://10.0.2.2:5000/api
```
> Use `10.0.2.2` for Android emulator (maps to localhost). Use your LAN IP for physical device.

---

## 🚀 Installation & Run

### 1. Backend
```powershell
cd c:\Sk\backend
# Install dependencies
& "C:\Program Files\nodejs\npm.cmd" install

# Update MONGO_URI in .env with your Atlas connection string

# Seed database (admin + services)
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
& "C:\Program Files\nodejs\npm.cmd" run seed

# Start development server
& "C:\Program Files\nodejs\npm.cmd" run dev
```

### 2. Frontend — React Native
```powershell
cd c:\Sk\frontend

# Add Node to PATH first
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH

# Install all packages
& "C:\Program Files\nodejs\npm.cmd" install

# Start Metro bundler
& "C:\Program Files\nodejs\npm.cmd" start

# In another terminal, run on Android
& "C:\Program Files\nodejs\npm.cmd" run android
```

---

## 🌱 Seed Credentials
| Role       | Email                        | Password   |
|------------|------------------------------|------------|
| Admin      | admin@sktechnology.com       | Admin@123  |
| Technician | tech@sktechnology.com        | Tech@123   |
| Customer   | Register via app             | Your choice|

---

## 📡 API Endpoints
| Method | Endpoint                        | Access          |
|--------|---------------------------------|-----------------|
| POST   | /api/auth/register              | Public          |
| POST   | /api/auth/login                 | Public          |
| GET    | /api/auth/profile               | Authenticated   |
| GET    | /api/services                   | Public          |
| POST   | /api/services                   | Admin           |
| PUT    | /api/services/:id               | Admin           |
| DELETE | /api/services/:id               | Admin           |
| POST   | /api/orders                     | Customer        |
| GET    | /api/orders/my                  | Customer        |
| GET    | /api/orders/all                 | Admin           |
| GET    | /api/orders/assigned            | Technician      |
| PUT    | /api/orders/:id/assign          | Admin           |
| PUT    | /api/orders/:id/status          | Admin/Tech      |
| PUT    | /api/orders/:id/cancel          | Customer        |
| GET    | /api/orders/reports             | Admin           |
| GET    | /api/users                      | Admin           |
| PUT    | /api/users/:id/role             | Admin           |
| PUT    | /api/users/:id/status           | Admin           |
| POST   | /api/payments/create-order      | Customer        |
| POST   | /api/payments/verify            | Customer        |

---

## 📱 APK Build
```powershell
cd c:\Sk\frontend\android
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
.\gradlew assembleRelease
# APK: android/app/build/outputs/apk/release/app-release.apk
```

---

## ☁️ Render Deployment (Backend)
1. Push `c:\Sk\backend` to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Set Build Command: `npm install && npm run build`
4. Set Start Command: `node dist/server.js`
5. Add all environment variables from `.env`
6. Update frontend `API_URL` to your Render URL

---

## 🔑 Third-Party Setup
### MongoDB Atlas
1. Create cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist IP `0.0.0.0/0`
4. Copy connection string to `MONGO_URI`

### Razorpay
1. Create account at [razorpay.com](https://razorpay.com)
2. Get Key ID and Key Secret from Dashboard → Settings → API Keys
3. Add to backend `.env`

### Cloudinary
1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get Cloud Name, API Key, API Secret from Dashboard
3. Add to backend `.env`

---

## 🔐 Role-Based Access
| Feature                    | Admin | Technician | Customer |
|---------------------------|-------|------------|----------|
| Manage Users              | ✅    | ❌         | ❌       |
| CRUD Services             | ✅    | ❌         | ❌       |
| View All Orders           | ✅    | ❌         | ❌       |
| Assign Technician         | ✅    | ❌         | ❌       |
| View Assigned Jobs        | ❌    | ✅         | ❌       |
| Accept/Reject Job         | ❌    | ✅         | ❌       |
| Upload Work Proof         | ❌    | ✅         | ❌       |
| Book Service              | ❌    | ❌         | ✅       |
| Track Booking             | ❌    | ❌         | ✅       |
| Make Payment              | ❌    | ❌         | ✅       |
| View Reports              | ✅    | ❌         | ❌       |
