import { z } from 'zod';

// schema untuk create penyalur
export const createPenyalurSchema = z.object({
  nama_toko: z.string().min(1, 'Nama toko is required'),
  kategori: z.enum(['Makanan Siap Saji', 'Roti & Pastry', 'Jajanan & Kue']),
  nomor_whatsapp: z.string().min(1, 'Nomor WhatsApp is required'),
  alamat: z.string().min(1, 'Alamat is required'),
  latitude: z
    .number()
    .min(-90, 'Latitude tidak valid')
    .max(90, 'Latitude tidak valid')
    .optional(),
  longitude: z
    .number()
    .min(-180, 'Longitude tidak valid')
    .max(180, 'Longitude tidak valid')
    .optional(),
  patokan: z.string(),
});

// schema untuk update penyalur
export const updatePenyalurSchema = z.object({
  nama_toko: z.string().min(1, 'Nama toko is required').optional(),
  kategori: z
    .enum(['Makanan Siap Saji', 'Roti & Pastry', 'Jajanan & Kue'])
    .optional(),
  nomor_whatsapp: z.string().min(1, 'Nomor WhatsApp is required').optional(),
  alamat: z.string().min(1, 'Alamat is required').optional(),
  latitude: z.number().min(1, 'Latitude is required').optional(),
  longitude: z.number().min(1, 'Longitude is required').optional(),
  patokan: z.string().optional(),
});

// schema untuk validasi parameter
export const getPenyalurByIdSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

// infer TS types dari schema
export type UpdatePenyalurSchema = z.infer<typeof updatePenyalurSchema>;
export type CreatePenyalurSchema = z.infer<typeof createPenyalurSchema>;
export type GetPenyalurByIdSchema = z.infer<typeof getPenyalurByIdSchema>;
