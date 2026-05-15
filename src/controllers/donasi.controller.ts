import { Request, Response, NextFunction } from 'express';
import { donasiTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
const db = drizzle(process.env.DATABASE_URL!);

export const createDonasi = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newDonasi = await db
      .insert(donasiTable)
      .values({ ...req.body, expired_at: new Date(req.body.expired_at) })
      .returning();

    return res.status(200).json(newDonasi[0]);
  } catch (error) {
    next(error);
  }
};

export const updateDonasi = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const updatedDonasi = await db
      .update(donasiTable)
      .set({
        ...req.body,
        ...(req.body.expired_at && {
          expired_at: new Date(req.body.expired_at),
        }),
      })
      .where(eq(donasiTable.id, parseInt(req.params.id as string)))
      .returning();

    if (!updateDonasi.length) {
      return res.status(400).json({ error: 'User not found' });
    }

    return res.status(200).json(updatedDonasi[0]);
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
    const donasi = await db
      .select()
      .from(donasiTable)
      .where(eq(donasiTable.id, parseInt(req.params.id as string)));

    if (!donasi.length) {
      return res.status(404).json({ error: 'Donasi not found' });
    }

    return res.status(200).json(donasi[0]);
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
    const donasi = await db
      .delete(donasiTable)
      .where(eq(donasiTable.id, parseInt(req.params.id as string)))
      .returning();

    if (!donasi.length) {
      return res
        .status(404)
        .json({ success: false, message: 'Donasi not found' });
    }

    return res.status(200).json({ message: 'Donasi deleted successfully' });
  } catch (error) {
    next(error);
  }
};
