import mongoose, { Document } from 'mongoose';
export type UserRole = 'admin' | 'technician' | 'customer';
export type TechnicianStatus = 'available' | 'busy' | 'offline';
export interface IUser extends Document {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    address?: string;
    technicianStatus: TechnicianStatus;
    comparePassword(candidatePassword: string): Promise<boolean>;
    createdAt: Date;
    updatedAt: Date;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default User;
//# sourceMappingURL=User.d.ts.map