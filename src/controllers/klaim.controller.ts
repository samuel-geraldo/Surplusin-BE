import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { klaimTable, donasiTable } from '../db/schema';
import { penerimaTable } from '../db/schema';
import { penyalurTable } from '../db/schema';
import { and, eq, inArray } from 'drizzle-orm';

import { drizzle } from 'drizzle-orm/node-postgres';
const db = drizzle(process.env.DATABASE_URL!);

export const getKlaimAktifPenyalur = async (
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

    const activeStatuses = ['claimed', 'on_the_way', 'arrived'] as const;

    const result = await db
      .select({
        klaim_id: klaimTable.id,
        status: klaimTable.status,
        nama_penerima: penerimaTable.nama_instansi,
        nama_donasi: donasiTable.nama,
        jumlah: donasiTable.jumlah,
        satuan: donasiTable.satuan,
        claimed_at: klaimTable.claimed_at,
      })
      .from(klaimTable)
      .innerJoin(donasiTable, eq(klaimTable.donasi_id, donasiTable.id))
      .innerJoin(penerimaTable, eq(klaimTable.penerima_id, penerimaTable.id))
      .where(
        and(
          eq(donasiTable.penyalur_id, penyalur[0].id),
          inArray(klaimTable.status, activeStatuses),
        ),
      );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

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
        .set({ status: 'diterima' })
        .where(eq(donasiTable.id, updatedKlaim[0].donasi_id));
    }

    return res.status(200).json(updatedKlaim[0]);
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

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllKlaim = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const klaim = await db.select().from(klaimTable);
    res.json(klaim);
  } catch (error) {
    next(error);
  }
};
