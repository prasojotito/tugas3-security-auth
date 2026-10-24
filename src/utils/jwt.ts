import 'dotenv/config';
import jwt, { type SignOptions } from 'jsonwebtoken';

export type Role = 'admin' | 'owner' | 'customer';
export const ROLES: Role[] = ['admin', 'owner', 'customer'];

export interface AuthPayload {
  id: number;
  role: Role;
}

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error('JWT_SECRET belum diatur di file .env');
}
const expiresIn = (process.env.JWT_EXPIRES_IN ?? '1h') as SignOptions['expiresIn'];

export const signToken = (payload: AuthPayload): string =>
  jwt.sign({ id: payload.id, role: payload.role }, secret, { algorithm: 'HS256', expiresIn });

// Melempar error bila token rusak, salah tanda tangan, atau kedaluwarsa.
export const verifyToken = (token: string): AuthPayload => {
  const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });
  if (typeof decoded === 'string') throw new Error('Payload token tidak valid');

  const id = Number(decoded.id);
  const role = decoded.role as Role;
  if (!Number.isInteger(id) || !ROLES.includes(role)) {
    throw new Error('Payload token tidak valid');
  }
  return { id, role };
};