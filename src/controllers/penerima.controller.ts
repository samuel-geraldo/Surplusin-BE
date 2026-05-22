import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { penerimaTable } from '../db/schema';
import { getNearbyDonasi } from '../services/matching.services';
import bcrypt from 'bcryptjs';
const db = drizzle(process.env.DATABASE_URL!);

export const getAllPenerima = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const penerima = await db.select().from(penerimaTable);
    res.json(penerima);
  } catch (error) {
    next(error);
  }
};

export const getPenerimaByJWT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.id;

    const penerima = await db
      .select({
        nama_instansi: penerimaTable.nama_instansi,
        kategori: penerimaTable.kategori,
        nomor_whatsapp: penerimaTable.nomor_whatsapp,
        alamat: penerimaTable.alamat,
        latitude: penerimaTable.latitude,
        longitude: penerimaTable.longitude,
        patokan: penerimaTable.patokan,
      })
      .from(penerimaTable)
      .where(eq(penerimaTable.user_id, user_id));

    if (penerima.length === 0) {
      return res.status(404).json({ error: 'Penerima not found' });
    }

    res.json(penerima);
  } catch (error) {
    next(error);
  }
};

export const createPenerima = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.id;
    const {
      nama_instansi,
      kategori,
      nomor_whatsapp,
      alamat,
      latitude,
      longitude,
      patokan,
    } = req.body;
    const data: any = {
      nama_instansi,
      kategori,
      nomor_whatsapp,
      alamat,
      jumlah_klaim: 0,
      latitude,
      longitude,
      user_id,
    };

    if (patokan !== undefined) data.patokan = patokan;

    const newPenerima = await db.insert(penerimaTable).values(data).returning();
    res.json(newPenerima);
  } catch (error) {
    next(error);
  }
};

export const getPenerimaById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id as string);
    const penerima = await db
      .select()
      .from(penerimaTable)
      .where(eq(penerimaTable.id, id));
    if (penerima.length === 0) {
      return res.status(404).json({ error: 'Penerima not found' });
    }
    res.json(penerima[0]);
  } catch (error) {
    next(error);
  }
};

export const deletePenerima = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id as string);
    const penerima = await db
      .delete(penerimaTable)
      .where(eq(penerimaTable.id, id))
      .returning();
    if (penerima.length === 0) {
      return res.status(404).json({ error: 'Penerima not found' });
    }
    res.json({ message: 'Penerima deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const updatePenerima = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id as string);
    const {
      nama_instansi,
      kategori,
      nomor_whatsapp,
      alamat,
      latitude,
      longitude,
      patokan,
    } = req.body;
    const data: any = {};
    if (nama_instansi) data.nama_instansi = nama_instansi;
    if (kategori) data.kategori = kategori;
    if (nomor_whatsapp) data.nomor_whatsapp = nomor_whatsapp;
    if (alamat) data.alamat = alamat;
    if (latitude !== undefined) data.latitude = latitude;
    if (longitude !== undefined) data.longitude = longitude;
    if (patokan) data.patokan = patokan;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'No data to update' });
    }

    const updated = await db
      .update(penerimaTable)
      .set(data)
      .where(eq(penerimaTable.id, id))
      .returning();
    if (updated.length === 0) {
      return res.status(404).json({ error: 'Penerima not found' });
    }
    res.json(updated[0]);
  } catch (error) {
    next(error);
  }
};

export const getNearbyDonasiController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.id;

    const donasi = await getNearbyDonasi(user_id);

    return res.status(200).json(donasi);
  } catch (error) {
    next(error);
  }
};
