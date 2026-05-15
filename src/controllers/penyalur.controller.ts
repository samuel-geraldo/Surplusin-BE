import { Request, Response, NextFunction } from 'express';
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

export const createPenyalur = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      nama_toko,
      kategori,
      nomor_whatsapp,
      alamat,
      latitude,
      longitude,
      user_id,
    } = req.body;
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
    const { nama_toko, kategori, nomor_whatsapp, alamat, latitude, longitude } =
      req.body;
    const data: any = {};
    if (nama_toko) data.nama_toko = nama_toko;
    if (kategori) data.kategori = kategori;
    if (nomor_whatsapp) data.nomor_whatsapp = nomor_whatsapp;
    if (alamat) data.alamat = alamat;
    if (latitude !== undefined) data.latitude = latitude;
    if (longitude !== undefined) data.longitude = longitude;
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
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { latitude, longitude, radius } = (req as any).validatedQuery;

    const penerima = await getNearbyPenerima(
      parseFloat(latitude as string),
      parseFloat(longitude as string),
      radius ? parseFloat(radius as string) : 5,
    );

    res.status(200).json({ success: true, data: penerima });
  } catch (error) {
    next(error);
  }
};
