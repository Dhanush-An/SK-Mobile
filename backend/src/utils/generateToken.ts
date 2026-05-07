import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export interface TokenPayload {
  userId: string;
  role: string;
}

const generateToken = (userId: Types.ObjectId | string, role: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');

  return jwt.sign(
    { userId: userId.toString(), role },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
  );
};

export default generateToken;
