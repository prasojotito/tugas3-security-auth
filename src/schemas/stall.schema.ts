import { z } from 'zod';

const requiredString = (field: string) =>
  z.string({
    error: (iss) => (iss.input === undefined ? `${field} wajib diisi` : `${field} harus berupa string`),
  });

export const stallIdParams = z.object({
  id: z.coerce
    .number({ error: 'id harus berupa angka' })
    .int('id harus berupa bilangan bulat')
    .positive('id harus lebih dari 0'),
});

export const listStallsQuery = z.object({
  search: z.string().trim().max(100, 'search maksimal 100 karakter').optional(),
  category: z.string().trim().max(50, 'category maksimal 50 karakter').optional(),
  page: z.coerce.number({ error: 'page harus berupa angka' }).int('page harus bilangan bulat').min(1, 'page minimal 1').default(1),
  limit: z.coerce.number({ error: 'limit harus berupa angka' }).int('limit harus bilangan bulat').min(1, 'limit minimal 1').max(100, 'limit maksimal 100').default(10),
});

export const createStallBody = z.object({
  name: requiredString('name').trim().min(3, 'name minimal 3 karakter').max(100, 'name maksimal 100 karakter'),
  category: z.string().trim().max(50, 'category maksimal 50 karakter').optional(),
  location: z.string().max(100, 'location maksimal 100 karakter').optional(),
  description: z.string().max(1000, 'description maksimal 1000 karakter').optional(),
});

export const updateStallBody = createStallBody
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'minimal satu field harus diisi',
  });

export const createReviewBody = z.object({
  rating: z
    .number({ error: (iss) => (iss.input === undefined ? 'rating wajib diisi' : 'rating harus berupa angka') })
    .int('rating harus bilangan bulat')
    .min(1, 'rating minimal 1')
    .max(5, 'rating maksimal 5'),
  comment: z.string().trim().max(1000, 'comment maksimal 1000 karakter').optional(),
});

export type ListStallsQuery = z.infer<typeof listStallsQuery>;
export type CreateStallBody = z.infer<typeof createStallBody>;
export type UpdateStallBody = z.infer<typeof updateStallBody>;
export type CreateReviewBody = z.infer<typeof createReviewBody>;