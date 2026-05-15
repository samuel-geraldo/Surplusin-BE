import { Router } from 'express';
import {
  validateBody,
  validateParams,
} from '../middlewares/validation.middleware';
import { verifyToken, authorizeRole } from '../middlewares/auth.middleware';
import {
  updateDonasiSchema,
  getDonasiByIdSchema,
  createDonasiSchema,
} from '../schemas/donasi.schema';
import {
  createDonasi,
  updateDonasi,
  getDonasiById,
  deleteDonasi,
} from '../controllers/donasi.controller';

const router = Router();

router.post(
  '/',
  verifyToken,
  authorizeRole(['penyalur']),
  validateBody(createDonasiSchema),
  createDonasi,
);

router.put(
  '/:id',
  verifyToken,
  authorizeRole(['penyalur']),
  validateParams(getDonasiByIdSchema),
  validateBody(updateDonasiSchema),
  updateDonasi,
);

router.get(
  '/:id',
  verifyToken,
  authorizeRole(['penyalur']),
  validateParams(getDonasiByIdSchema),
  getDonasiById,
);

router.delete(
  '/:id',
  verifyToken,
  authorizeRole(['penyalur']),
  validateParams(getDonasiByIdSchema),
  deleteDonasi,
);

export default router;
