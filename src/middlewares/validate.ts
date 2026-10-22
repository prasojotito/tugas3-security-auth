import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { AppError, type FieldError } from '../errors/AppError.ts';

type Schemas = { params?: ZodType; query?: ZodType; body?: ZodType };

export const validate = (schemas: Schemas): RequestHandler => (req, _res, next) => {
  const errors: FieldError[] = [];

  for (const key of ['params', 'query', 'body'] as const) {
    const schema = schemas[key];
    if (!schema) continue;

    const result = schema.safeParse(req[key] ?? {});
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push({ field: issue.path.join('.') || key, message: issue.message });
      }
    } else {
      Object.defineProperty(req, key, {
        value: result.data,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }
  }

  if (errors.length > 0) return next(new AppError(400, 'Validasi gagal', errors));
  next();
};