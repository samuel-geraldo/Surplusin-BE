import { Request, Response, NextFunction } from 'express';
import { eq, and, gt } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { donasiTable, penyalurTable, penerimaTable } from '../db/schema.js';
const db = drizzle(process.env.DATABASE_URL!);

// Haversine formula untuk hitung jarak antara 2 koordinat (dalam km)
const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // radius bumi dalam km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// memfilter donasi terdekat dari seorang penerima
export const getNearbyDonasi = async (user_id: number, radius: number = 5) => {
  const penerima = await db
    .select()
    .from(penerimaTable)
    .where(eq(penerimaTable.user_id, user_id));

  if (penerima.length === 0) {
    throw new Error('Penerima tidak ditemukan');
  }

  // ambil semua donasi yang available dan belum expired
  const donasi = await db
    .select({
      id: donasiTable.id,
      nama: donasiTable.nama,
      kategori: donasiTable.kategori,
      jumlah: donasiTable.jumlah,
      satuan: donasiTable.satuan,
      item_detail: donasiTable.item_detail,
      expired_at: donasiTable.expired_at,
      status: donasiTable.status,
      penyalur_id: donasiTable.penyalur_id,
      nama_toko: penyalurTable.nama_toko,
      penyalur_latitude: penyalurTable.latitude,
      penyalur_longitude: penyalurTable.longitude,
      alamat: penyalurTable.alamat,
    })
    .from(donasiTable)
    .innerJoin(penyalurTable, eq(donasiTable.penyalur_id, penyalurTable.id))
    .where(
      and(
        eq(donasiTable.status, 'tersedia'),
        gt(donasiTable.expired_at, new Date()),
      ),
    );

  const latitude = penerima[0].latitude;
  const longitude = penerima[0].longitude;
  // hitung jarak tiap donasi dari lokasi penerima, lalu filter by radius
  const result = donasi
    .map((d) => ({
      ...d,
      jarak_km: haversineDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(d.penyalur_latitude),
        parseFloat(d.penyalur_longitude),
      ),
    }))
    .filter((d) => d.jarak_km <= radius)
    .sort((a, b) => {
      // sort by expired_at ASC, kalau sama sort by jarak ASC
      const expA = new Date(a.expired_at).getTime();
      const expB = new Date(b.expired_at).getTime();
      if (expA !== expB) return expA - expB;
      return a.jarak_km - b.jarak_km;
    });

  return {
    total_donasi: result.length,
    donasi: result,
  };
};

// menghitung jumlah penerima terdekat perkategori
export const getNearbyPenerima = async (
  user_id: number,
  radius: number = 5,
) => {
  const penyalur = await db
    .select()
    .from(penyalurTable)
    .where(eq(penyalurTable.user_id, user_id));

  if (penyalur.length === 0) {
    throw new Error('Penyalur tidak ditemukan');
  }

  const latitude = penyalur[0].latitude;
  const longitude = penyalur[0].longitude;

  const penerima = await db
    .select({
      kategori: penerimaTable.kategori,
      latitude: penerimaTable.latitude,
      longitude: penerimaTable.longitude,
    })
    .from(penerimaTable);

  const filtered = penerima.filter(
    (p) =>
      haversineDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(p.latitude),
        parseFloat(p.longitude),
      ) <= radius,
  );

  const result = filtered.reduce(
    (acc, p) => {
      acc[p.kategori] = (acc[p.kategori] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return result;
};
