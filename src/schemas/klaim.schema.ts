import { z } from 'zod';

export const createKlaimSchema = z.object({
  penerima_id: z.number().min(1, 'Penerima ID is required'),
});

export const updateStatusKlaimSchema = z.object({
  status: z.enum(['on_the_way', 'arrived', 'completed']),
});

export const getKlaimByIdSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export const getKlaimByDonasiIdSchema = z.object({
  donasi_id: z.string().min(1, 'Donasi ID is required'),
});

export type CreateKlaimSchema = z.infer<typeof createKlaimSchema>;
export type UpdateStatusKlaimSchema = z.infer<typeof updateStatusKlaimSchema>;
export type GetKlaimByIdSchema = z.infer<typeof getKlaimByIdSchema>;
export type GetKlaimByDonasiIdSchema = z.infer<typeof getKlaimByDonasiIdSchema>;
