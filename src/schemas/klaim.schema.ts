import { z } from 'zod';

export const updateStatusKlaimSchema = z.object({
  status: z.enum(['on_the_way', 'arrived', 'completed']),
});

export const klaimIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID harus berupa angka'),
});

export type UpdateStatusKlaimSchema = z.infer<typeof updateStatusKlaimSchema>;
export type KlaimIdSchema = z.infer<typeof klaimIdSchema>;
