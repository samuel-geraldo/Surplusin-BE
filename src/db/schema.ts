import { integer, pgTable, varchar, pgEnum, text, decimal  } from 'drizzle-orm/pg-core';

export const kategoripenerimaEnum = pgEnum('kategoripenerima_enum', ['Panti Asuhan', 'Panti Jompo', 'Yayasan Sosial', 'Lainnya']);

export const kategoripenyalurEnum = pgEnum('kategoripenyalur_enum', ['Makanan Siap Saji', 'Roti & Pastry', 'Jajanan & Kue']);

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }),
  role: varchar({ length: 50 }).notNull(),
});

export const penerimaTable = pgTable('penerima', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  nama_instansi: varchar({ length: 255 }).notNull(),
  kategori: kategoripenerimaEnum('kategori').notNull(),
  nomor_whatsapp: varchar({ length: 20 }).notNull(),
  alamat: text('alamat').notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 7 }).notNull(),
  longitude: decimal('longitude', { precision: 10, scale: 7 }).notNull(),
  user_id: integer().notNull().references(() => usersTable.id),
});

export const penyalurTable = pgTable('penyalur', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  nama_toko: varchar({ length: 255 }).notNull(),
  kategori: kategoripenyalurEnum('kategori').notNull(),
  nomor_whatsapp: varchar({ length: 20 }).notNull(),
  alamat: text('alamat').notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 7 }).notNull(),
  longitude: decimal('longitude', { precision: 10, scale: 7 }).notNull(),
  user_id: integer().notNull().references(() => usersTable.id),
});
