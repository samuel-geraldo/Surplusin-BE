import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { penyalurTable } from '../db/schema';
import { getNearbyPenerima } from '../services/matching.services';
import bcrypt from 'bcryptjs';
import { success } from 'zod/index.cjs';
const db = drizzle(process.env.DATABASE_URL!);

export const getAllPenyalur = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const penyalur = await db.select().from(penyalurTable);
    res.json(penyalur);
  } catch (error) {
    next(error);
  }
};

export const getDataPenyalurByJWT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = req.user?.id;

    const penyalur = await db
      .select({
        nama_toko: penyalurTable.nama_toko,
        kategori: penyalurTable.kategori,
        nomor_whatsapp: penyalurTable.nomor_whatsapp,
        alamat: penyalurTable.alamat,
        latitude: penyalurTable.latitude,
        longitude: penyalurTable.longitude,
        patokan: penyalurTable.patokan,
      })
      .from(penyalurTable)
      .where(eq(penyalurTable.user_id, user_id));

    if (penyalur.length === 0) {
      return res.status(404).json({ error: 'Penyalur not found' });
    }

    res.json(penyalur[0]);
  } catch (error) {
    next(error);
  }
}

export const createPenyalur = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.id;
    const { nama_toko, kategori, nomor_whatsapp, alamat, latitude, longitude } =
      req.body;
    const newPenyalur = await db
      .insert(penyalurTable)
      .values({
        nama_toko,
        kategori,
        nomor_whatsapp,
        alamat,
        latitude,
        longitude,
        user_id,
      })
      .returning();
    res.json(newPenyalur);
  } catch (error) {
    next(error);
  }
};

export const getPenyalurById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id as string);
    const penyalur = await db
      .select()
      .from(penyalurTable)
      .where(eq(penyalurTable.id, id));
    if (penyalur.length === 0) {
      return res.status(404).json({ error: 'Penyalur not found' });
    }
    res.json(penyalur[0]);
  } catch (error) {
    next(error);
  }
};

export const updatePenyalur = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id as string);
    const { nama_toko, kategori, nomor_whatsapp, alamat, latitude, longitude, patokan } =
      req.body;
    const data: any = {};
    if (nama_toko) data.nama_toko = nama_toko;
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
      .update(penyalurTable)
      .set(data)
      .where(eq(penyalurTable.id, id))
      .returning();
    if (updated.length === 0) {
      return res.status(404).json({ error: 'Penyalur not found' });
    }
    res.json(updated[0]);
  } catch (error) {
    next(error);
  }
};

export const deletePenyalur = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = parseInt(req.params.id as string);
    const penyalur = await db
      .delete(penyalurTable)
      .where(eq(penyalurTable.id, id))
      .returning();
    if (penyalur.length === 0) {
      return res.status(404).json({ error: 'Penyalur not found' });
    }
    res.json({ message: 'Penyalur deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getNearbyPenerimaController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.user?.id;

    const penerima = await getNearbyPenerima(user_id);

    res.status(200).json(penerima);
  } catch (error) {
    next(error);
  }
};
