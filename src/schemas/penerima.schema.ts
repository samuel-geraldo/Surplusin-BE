import { z } from 'zod';

// schema untuk create penerima
export const createPenerimaSchema = z.object({
  nama_instansi: z.string().min(1, 'Nama instansi is required'),
  kategori: z.enum([
    'Panti Asuhan',
    'Panti Jompo',
    'Yayasan Sosial',
    'Lainnya',
  ]),
  nomor_whatsapp: z.string().min(1, 'Nomor WhatsApp is required'),
  alamat: z.string().min(1, 'Alamat is required'),
  latitude: z
    .number()
    .min(-90, 'Latitude tidak valid')
    .max(90, 'Latitude tidak valid'),
  longitude: z
    .number()
    .min(-180, 'Longitude tidak valid')
    .max(180, 'Longitude tidak valid'),
  patokan: z.string().optional(),
});

// schema untuk update penerima
export const updatePenerimaSchema = z.object({
  nama_instansi: z.string().min(1, 'Nama instansi is required').optional(),
  kategori: z
    .enum(['Panti Asuhan', 'Panti Jompo', 'Yayasan Sosial', 'Lainnya'])
    .optional(),
  nomor_whatsapp: z.string().min(1, 'Nomor WhatsApp is required').optional(),
  alamat: z.string().min(1, 'Alamat is required').optional(),
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
  patokan: z.string().optional(),
});

// schema untuk validasi parameter
export const getPenerimaByIdSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

// infer TS types dari schema
export type UpdatePenerimaSchema = z.infer<typeof updatePenerimaSchema>;
export type CreatePenerimaSchema = z.infer<typeof createPenerimaSchema>;
export type GetPenerimaByIdSchema = z.infer<typeof getPenerimaByIdSchema>;
