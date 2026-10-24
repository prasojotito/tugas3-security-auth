import type { RequestHandler } from 'express';
import { AppError } from '../errors/AppError.ts';
import { verifyToken } from '../utils/jwt.ts';

export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header) return next(new AppError(401, 'Token tidak ditemukan'));

  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(new AppError(401, 'Format header Authorization harus: Bearer <token>'));
  }

  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return next(new AppError(401, 'Token tidak valid atau sudah kedaluwarsa'));
  }
};