import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { klaimTable, donasiTable } from '../db/schema';
import { penerimaTable } from '../db/schema';
import { penyalurTable } from '../db/schema';
import { count, eq, notExists, sum, max } from 'drizzle-orm';

import { drizzle } from 'drizzle-orm/node-postgres';
const db = drizzle(process.env.DATABASE_URL!);

export const createKlaim = async (
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

    const donasiId = parseInt(req.params.donasi_id as string);

    const donasi = await db
      .select()
      .from(donasiTable)
      .where(eq(donasiTable.id, donasiId));

    if (!donasi.length) {
      return res.status(404).json({ message: 'Donasi not found' });
    }

    if (donasi[0].status !== 'tersedia') {
      return res.status(409).json({ message: 'Donasi has been claimed' });
    }

    const penerimaId = penerima[0].id;

    const result = await db.transaction(async (tx) => {
      const klaim = await tx
        .insert(klaimTable)
        .values({
          donasi_id: donasiId,
          penerima_id: penerimaId,
        })
        .returning();

      await tx
        .update(donasiTable)
        .set({ status: 'diklaim' })
        .where(eq(donasiTable.id, donasiId));

      await tx
        .update(penerimaTable)
        .set({ jumlah_klaim: penerima[0].jumlah_klaim + 1 })
        .where(eq(penerimaTable.id, penerimaId));

      return klaim[0];
    });

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getKlaimByDonasi = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await db
      .select()
      .from(klaimTable)
      .where(
        eq(klaimTable.donasi_id, parseInt(req.params.donasi_id as string)),
      );

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
};




