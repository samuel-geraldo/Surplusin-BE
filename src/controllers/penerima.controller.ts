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
    } = req.body;
    const newPenerima = await db
      .insert(penerimaTable)
      .values({
        nama_instansi,
        kategori,
        nomor_whatsapp,
        alamat,
        jumlah_klaim: 0,
        latitude,
        longitude,
        user_id,
      })
      .returning();
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
    } = req.body;
    const data: any = {};
    if (nama_instansi) data.nama_instansi = nama_instansi;
    if (kategori) data.kategori = kategori;
    if (nomor_whatsapp) data.nomor_whatsapp = nomor_whatsapp;
    if (alamat) data.alamat = alamat;
    if (latitude !== undefined) data.latitude = latitude;
    if (longitude !== undefined) data.longitude = longitude;

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
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { latitude, longitude, radius } = (req as any).validatedQuery;

    const donasi = await getNearbyDonasi(
      parseFloat(latitude as string),
      parseFloat(longitude as string),
      radius ? parseFloat(radius as string) : 5,
    );

    return res.status(200).json(donasi);
  } catch (error) {
    next(error);
  }
};
