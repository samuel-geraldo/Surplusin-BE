import { Request, Response, NextFunction } from 'express';
import { klaimTable, donasiTable } from '../db/schema';
import { eq, notExists } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { updateDonasi } from './donasi.controller';
const db = drizzle(process.env.DATABASE_URL!);

export const createKlaim = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const donasiId = parseInt(req.params.donasi_id as string);

    // cek donasi masih available
    const donasi = await db
      .select()
      .from(donasiTable)
      .where(eq(donasiTable.id, donasiId));

    if (!donasi.length) {
      return res.status(404).json({ message: 'Donasi not found' });
    }

    if (donasi[0].status !== 'available') {
      return res.status(409).json({ message: 'Donasi has been claimed' });
    }

    // klaim + update status donasi
    const result = await db.transaction(async (tx) => {
      const klaim = await tx
        .insert(klaimTable)
        .values({
          donasi_id: donasiId,
          penerima_id: req.body.penerima_id,
        })
        .returning();

      await tx
        .update(donasiTable)
        .set({ status: 'claimed' })
        .where(eq(donasiTable.id, donasiId));

      return klaim[0];
    });

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateStatusKlaim = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const timestampField = {
      on_the_way: {},
      arrived: { arrived_at: new Date() },
      completed: { completed_at: new Date() },
    }[req.body.status as string];

    const updatedKlaim = await db
      .update(klaimTable)
      .set({ status: req.body.status, ...timestampField })
      .where(eq(klaimTable.id, parseInt(req.params.id as string)))
      .returning();

    if (!updatedKlaim.length) {
      return res.status(404).json({ message: 'Klaim not found' });
    }

    // update status donasi
    if (req.body.status === 'completed') {
      await db
        .update(donasiTable)
        .set({ status: 'completed' })
        .where(eq(donasiTable.id, updatedKlaim[0].donasi_id));
    }

    return res.status(200).json(updatedKlaim[0]);
  } catch (error) {
    next(error);
  }
};

export const getKlaimByPenerima = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await db
      .select()
      .from(klaimTable)
      .where(eq(klaimTable.penerima_id, parseInt(req.params.id as string)));

    return res.status(200).json(result);
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
