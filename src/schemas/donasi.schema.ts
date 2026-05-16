import { z } from 'zod';

export const createDonasiSchema = z.object({
  nama: z.string().min(1, 'Nama donasi is required'),
  kategori: z.enum(['Makanan Siap Saji', 'Roti & Pastry', 'Jajanan & Kue']),
  jumlah: z.number().min(1, 'Jumlah minimal 1'),
  satuan: z.enum(['Pcs', 'Kg', 'Porsi', 'Paket']),
  item_detail: z.string().optional(),
});

export const getDonasiByNamaSchema = z.object({
  nama: z.string().min(1, 'Nama donasi is required'),
})

export const getDonasiByKategoriSchema = z.object({
  kategori: z.enum(['Makanan Siap Saji', 'Roti & Pastry', 'Jajanan & Kue']),
})


export const getDonasiByIdSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export const deleteDonasiSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});


export type CreateDonasiSchema = z.infer<typeof createDonasiSchema>;
export type GetDonasiByNamaSchema = z.infer<typeof getDonasiByNamaSchema>;
export type GetDonasiByKategoriSchema = z.infer<typeof getDonasiByKategoriSchema>;
export type GetDonasiByIdSchema = z.infer<typeof getDonasiByIdSchema>;
export type DeleteDonasi = z.infer<typeof deleteDonasiSchema>;
