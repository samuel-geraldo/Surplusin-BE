import {
  integer,
  pgTable,
  varchar,
  pgEnum,
  text,
  decimal,
  timestamp,
} from 'drizzle-orm/pg-core';

export const kategoripenerimaEnum = pgEnum('kategoripenerima_enum', [
  'Panti Asuhan',
  'Panti Jompo',
  'Yayasan Sosial',
  'Lainnya',
]);

export const kategoridonasiEnum = pgEnum('kategoridonasi_enum', [
  'Makanan Siap Saji',
  'Roti & Pastry',
  'Jajanan & Kue',
]);

export const statusDonasiEnum = pgEnum('status_donasi_enum', [
  'tersedia',
  'diklaim',
  'diterima',
]);

export const statusKlaimEnum = pgEnum('status_klaim_enum', [
  'claimed',
  'on_the_way',
  'arrived',
  'completed',
]);

export const satuanEnum = pgEnum('satuan_enum', [
  'Pcs',
  'Kg',
  'Porsi',
  'Paket',
]);

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
  jumlah_klaim: integer().notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 7 }).notNull(),
  longitude: decimal('longitude', { precision: 10, scale: 7 }).notNull(),
  user_id: integer()
    .notNull()
    .references(() => usersTable.id),
});

export const penyalurTable = pgTable('penyalur', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  nama_toko: varchar({ length: 255 }).notNull(),
  kategori: kategoridonasiEnum('kategori').notNull(),
  nomor_whatsapp: varchar({ length: 20 }).notNull(),
  alamat: text('alamat').notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 7 }).notNull(),
  longitude: decimal('longitude', { precision: 10, scale: 7 }).notNull(),
  user_id: integer()
    .notNull()
    .references(() => usersTable.id),
});

export const donasiTable = pgTable('donasi', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  penyalur_id: integer()
    .notNull()
    .references(() => penyalurTable.id),
  nama: varchar({ length: 255 }).notNull(),
  kategori: kategoridonasiEnum('kategori').notNull(),
  jumlah: integer().notNull(),
  satuan: satuanEnum('satuan').notNull(),
  item_detail: text('item_detail'),
  expired_at: timestamp('expired_at').notNull(),
  status: statusDonasiEnum('status').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

export const klaimTable = pgTable('klaim', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  donasi_id: integer()
    .notNull()
    .references(() => donasiTable.id),
  penerima_id: integer()
    .notNull()
    .references(() => penerimaTable.id),
  status: statusKlaimEnum('status').default('claimed'),
  claimed_at: timestamp('claimed_at').defaultNow(),
  arrived_at: timestamp('arrived_at'),
  completed_at: timestamp('completed_at'),
});
