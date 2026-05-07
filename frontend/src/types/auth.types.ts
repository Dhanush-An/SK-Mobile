export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'technician' | 'customer';
  isActive: boolean;
  technicianStatus?: 'available' | 'busy' | 'offline';
  createdAt: string;
}
