import { z } from 'zod';

export const createDonasiSchema = z.object({
  penyalur_id: z.number().min(1, 'Penyalur ID is required'),
  nama: z.string().min(1, 'Nama donasi is required'),
  kategori: z.enum(['Makanan Siap Saji', 'Roti & Pastry', 'Jajanan & Kue']),
  jumlah: z.number().min(1, 'Jumlah minimal 1'),
  satuan: z.enum(['porsi', 'kg', 'box', 'pcs']),
  item_detail: z.string().optional(),
  expired_at: z.string().datetime('Format tanggal tidak valid'),
});

export const updateDonasiSchema = z.object({
  nama: z.string().min(1, 'Nama donasi is required').optional(),
  kategori: z
    .enum(['Makanan Siap Saji', 'Roti & Pastry', 'Jajanan & Kue'])
    .optional(),
  jumlah: z.number().min(1, 'Jumlah minimal 1').optional(),
  satuan: z.enum(['porsi', 'kg', 'box', 'pcs']).optional(),
  item_detail: z.string().optional(),
  expired_at: z.string().datetime('Format tanggal tidak valid').optional(),
});

export const getDonasiByIdSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export type CreateDonasiSchema = z.infer<typeof createDonasiSchema>;
export type UpdateDonasiSchema = z.infer<typeof updateDonasiSchema>;
export type GetDonasiByIdSchema = z.infer<typeof getDonasiByIdSchema>;
