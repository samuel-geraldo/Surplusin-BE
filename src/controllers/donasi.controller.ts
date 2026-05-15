import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { donasiTable } from '../db/schema';
import { penyalurTable } from '../db/schema';
import { kategoridonasiEnum } from '../db/schema';
import { statusDonasiEnum } from '../db/schema';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
const db = drizzle(process.env.DATABASE_URL!);

type KategoriDonasi = typeof kategoridonasiEnum.enumValues[number];
const getDefaultExpired = (kategori: KategoriDonasi): Date => {
  const now = new Date();
  
  switch (kategori) {
    case 'Makanan Siap Saji':
      now.setHours(now.getHours() + 3);   // 3 jam
      break;
    case 'Roti & Pastry':
      now.setHours(now.getHours() + 24);  // 1 hari
      break;
    case 'Jajanan & Kue':
      now.setHours(now.getHours() + 48);  // 2 hari
      break;
  }
  
  return now;
};
export const createDonasi = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try{
  const user_id = req.user?.id

  const penyalur = await db
    .select()
    .from(penyalurTable)
    .where(eq(penyalurTable.user_id, user_id));

  if (penyalur.length === 0) {
    return res.status(404).json({ error: 'Penyalur not found' });
  }

  const penyalur_id = penyalur[0].id;

  const { nama, kategori, jumlah, satuan, item_detail} = req.body;
  const expired_at = getDefaultExpired(kategori);
  const donasi = await db
    .insert(donasiTable)
    .values({ penyalur_id, nama, kategori, jumlah, satuan, item_detail, expired_at, status: 'tersedia' })
    .returning();

  res.json(donasi);
}
catch (error) {
  next(error);
}
};

export const getAllDonasi = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const donasi = 
    await db
    .select({
      nama: donasiTable.nama,
      kategori: donasiTable.kategori,
      jumlah: donasiTable.jumlah,
      satuan: donasiTable.satuan,
      status: donasiTable.status,
      expired_at: donasiTable.expired_at,
    }).from(donasiTable);
    res.json(donasi);
  } catch (error) {
    next(error);
  }
}

export const getDonasiByNama = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const nama = req.query.nama as string;
        const donasi = await db
            .select()
            .from(donasiTable)
            .where(eq(donasiTable.nama, nama));

        if (donasi.length === 0) {
            return res.status(404).json({ error: 'Donasi not found' });
        }

        res.json(donasi);
    } catch (error) {
        next(error);
    }
}

export const getDonasiById = async (
    req: Request,
    res: Response,
    next: NextFunction
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
}

export const getDetailItemDonasi = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id as string);
    const donasi = await db
      .select({
        nama: donasiTable.nama,
        jumlah: donasiTable.jumlah,
        satuan: donasiTable.satuan,
        item_detail: donasiTable.item_detail
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
}

export const getDonasiByKategori = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
  try {
    const kategori = req.query.kategori as KategoriDonasi;
    const donasi = await db
      .select()
      .from(donasiTable)
      .where(eq(donasiTable.kategori, kategori));

    if (donasi.length === 0) {
      return res.status(404).json({ error: 'Donasi not found' });
    }

    res.json(donasi);
  } catch (error) {
    next(error);
  }
}

export const deleteDonasi = async (
  req: Request,
  res: Response,
  next: NextFunction
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
}

