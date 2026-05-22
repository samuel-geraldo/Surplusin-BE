import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { donasiTable } from '../db/schema';
import { penyalurTable } from '../db/schema';
import { penerimaTable } from '../db/schema';
import { klaimTable } from '../db/schema';
import { count, sum, max, and } from 'drizzle-orm';
import { kategoridonasiEnum } from '../db/schema';
import { statusDonasiEnum } from '../db/schema';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
const db = drizzle(process.env.DATABASE_URL!);

type KategoriDonasi = (typeof kategoridonasiEnum.enumValues)[number];
const getDefaultExpired = (kategori: KategoriDonasi): Date => {
  const now = new Date();

  switch (kategori) {
    case 'Makanan Siap Saji':
      now.setHours(now.getHours() + 3); // 3 jam
      break;
    case 'Roti & Pastry':
      now.setHours(now.getHours() + 24); // 1 hari
      break;
    case 'Jajanan & Kue':
      now.setHours(now.getHours() + 48); // 2 hari
      break;
  }

  return now;
};
export const createDonasi = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.id;

    const penyalur = await db
      .select()
      .from(penyalurTable)
      .where(eq(penyalurTable.user_id, user_id));

    if (penyalur.length === 0) {
      return res.status(404).json({ error: 'Penyalur not found' });
    }

    const penyalur_id = penyalur[0].id;

    const { nama, kategori, jumlah, satuan, item_detail } = req.body;
    const expired_at = getDefaultExpired(kategori);
    const donasi = await db
      .insert(donasiTable)
      .values({
        penyalur_id,
        nama,
        kategori,
        jumlah,
        satuan,
        item_detail,
        expired_at,
        status: 'tersedia',
      })
      .returning();

    res.json(donasi);
  } catch (error) {
    next(error);
  }
};

export const getAllDonasi = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const donasi = await db.select().from(donasiTable);
    res.json(donasi);
  } catch (error) {
    next(error);
  }
};

export const getDonasiPenyalurLogin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.id;
    const penyalur = await db
      .select()
      .from(penyalurTable)
      .where(eq(penyalurTable.user_id, user_id));

    if (penyalur.length === 0) {
      return res.status(404).json({ error: 'Penyalur not found' });
    }
    const donasi = await db
      .select({
        id: donasiTable.id,
        nama: donasiTable.nama,
        kategori: donasiTable.kategori,
        jumlah: donasiTable.jumlah,
        satuan: donasiTable.satuan,
        item_detail: donasiTable.item_detail,
        expired_at: donasiTable.expired_at,
      })
      .from(donasiTable)
      .where(eq(donasiTable.penyalur_id, penyalur[0].id));
    res.json(donasi);
  } catch (error) {
    next(error);
  }
};

export const getDonasiByNama = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const nama = req.query.nama as string;
    const donasi = await db
      .select()
      .from(donasiTable)
      .where(
        and(eq(donasiTable.nama, nama), eq(donasiTable.status, 'tersedia')),
      );

    if (donasi.length === 0) {
      return res.status(404).json({ error: 'Donasi not found' });
    }

    res.json(donasi);
  } catch (error) {
    next(error);
  }
};

export const getDonasiById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id as string);
    const donasi = await db
      .select()
      .from(donasiTable)
      .where(eq(donasiTable.id, id));

    if (donasi.length === 0) {
      return res.status(404).json({ error: 'Donasi not found' });
    }

    res.json(donasi);
  } catch (error) {
    next(error);
  }
};

export const getDetailItemDonasi = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id as string);
    const donasi = await db
      .select({
        nama: donasiTable.nama,
        jumlah: donasiTable.jumlah,
        satuan: donasiTable.satuan,
        item_detail: donasiTable.item_detail,
      })
      .from(donasiTable)
      .where(eq(donasiTable.id, id));
    if (donasi.length === 0) {
      return res.status(404).json({ error: 'Donasi not found' });
    }
    res.json(donasi);
  } catch (error) {
    next(error);
  }
};

export const getDonasiByKategori = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const kategori = req.query.kategori as KategoriDonasi;
    const donasi = await db
      .select()
      .from(donasiTable)
      .where(
        and(
          eq(donasiTable.kategori, kategori),
          eq(donasiTable.status, 'tersedia'),
        ),
      );

    if (donasi.length === 0) {
      return res.status(404).json({ error: 'Donasi not found' });
    }

    res.json(donasi);
  } catch (error) {
    next(error);
  }
};

export const deleteDonasi = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id as string);
    const donasi = await db
      .delete(donasiTable)
      .where(eq(donasiTable.id, id))
      .returning();
    if (donasi.length === 0) {
      return res.status(404).json({ error: 'Donasi not found' });
    }
    res.json({ message: 'Donasi deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getRiwayatPenerima = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    const penerima = await db
      .select()
      .from(penerimaTable)
      .where(eq(penerimaTable.user_id, userId));

    if (!penerima.length) {
      return res.status(404).json({ message: 'Penerima not found' });
    }

    const penerimaId = penerima[0].id;

    const result = await db
      .select({
        nama_toko: penyalurTable.nama_toko,
        alamat: penyalurTable.alamat,
        nama_donasi: donasiTable.nama,
        total_porsi: sum(donasiTable.jumlah),
        jumlah_donasi: count(klaimTable.id),
        terakhir: max(klaimTable.claimed_at),
      })
      .from(klaimTable)
      .innerJoin(donasiTable, eq(klaimTable.donasi_id, donasiTable.id))
      .innerJoin(penyalurTable, eq(donasiTable.penyalur_id, penyalurTable.id))
      .where(
        and(
          eq(klaimTable.penerima_id, penerimaId),
          eq(klaimTable.status, 'completed'),
        ),
      )
      .groupBy(
        penyalurTable.id,
        penyalurTable.nama_toko,
        penyalurTable.alamat,
        donasiTable.nama,
      );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getRiwayatPenyerahan = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    const penyalur = await db
      .select()
      .from(penyalurTable)
      .where(eq(penyalurTable.user_id, userId));

    if (!penyalur.length) {
      return res.status(404).json({ message: 'Penyalur not found' });
    }

    const penyalurId = penyalur[0].id;

    const result = await db
      .select({
        nama_instansi: penerimaTable.nama_instansi,
        alamat: penerimaTable.alamat,
        jumlah_pengiriman: count(klaimTable.id),
        total_porsi: sum(donasiTable.jumlah),
        terakhir: max(klaimTable.claimed_at),
      })
      .from(klaimTable)
      .innerJoin(donasiTable, eq(klaimTable.donasi_id, donasiTable.id))
      .innerJoin(penerimaTable, eq(klaimTable.penerima_id, penerimaTable.id))
      .where(
        and(
          eq(donasiTable.penyalur_id, penyalurId),
          eq(klaimTable.status, 'completed'),
        ),
      )
      .groupBy(
        penerimaTable.id,
        penerimaTable.nama_instansi,
        penerimaTable.alamat,
      );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getStatistikDonasi = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [diklaim] = await db
      .select({ total: count() })
      .from(donasiTable)
      .where(eq(donasiTable.status, 'diklaim'));

    const [diterima] = await db
      .select({ total: count() })
      .from(donasiTable)
      .where(eq(donasiTable.status, 'diterima'));

    res.json({
      total_diklaim: diklaim.total,
      total_diterima: diterima.total,
    });
  } catch (error) {
    next(error);
  }
};
