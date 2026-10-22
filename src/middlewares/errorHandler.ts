import type { ErrorRequestHandler, RequestHandler } from 'express';
import { AppError } from '../errors/AppError.ts';

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new AppError(404, `Route ${req.method} ${req.path} tidak ditemukan`));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
      ...(err.errors && { errors: err.errors }),
    });
  }

  // JSON body rusak (dilempar oleh express.json)
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ status: 'fail', message: 'Body request bukan JSON yang valid' });
  }

  console.error(err);
  return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' });
};