import type { RequestHandler } from 'express';
import { AppError } from '../errors/AppError.ts';
import type { Role } from '../utils/jwt.ts';

export const authorize = (...allowedRoles: Role[]): RequestHandler => (req, _res, next) => {
  if (!req.user) return next(new AppError(401, 'Belum terautentikasi'));
  if (!allowedRoles.includes(req.user.role)) {
    return next(new AppError(403, 'Anda tidak memiliki akses ke resource ini'));
  }
  return next();
};