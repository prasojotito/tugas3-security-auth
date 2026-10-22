import { z } from 'zod';

const requiredString = (field: string) =>
  z.string({
    error: (iss) => (iss.input === undefined ? `${field} wajib diisi` : `${field} harus berupa string`),
  });

export const registerBody = z.object({
  name: requiredString('name').trim().min(3, 'name minimal 3 karakter').max(100, 'name maksimal 100 karakter'),
  email: requiredString('email').trim().toLowerCase().email('format email tidak valid').max(150, 'email maksimal 150 karakter'),
  password: requiredString('password').min(8, 'password minimal 8 karakter').max(72, 'password maksimal 72 karakter'),
});

export const loginBody = z.object({
  email: requiredString('email').trim().toLowerCase().email('format email tidak valid'),
  password: requiredString('password').min(1, 'password wajib diisi'),
});