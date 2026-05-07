import { Types } from 'mongoose';
export interface TokenPayload {
    userId: string;
    role: string;
}
declare const generateToken: (userId: Types.ObjectId | string, role: string) => string;
export default generateToken;
//# sourceMappingURL=generateToken.d.ts.map