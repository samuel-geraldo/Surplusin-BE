import { Router } from 'express';
import {
  validateBody,
  validateParams,
} from '../middlewares/validation.middleware';
import { verifyToken, authorizeRole } from '../middlewares/auth.middleware';
import {
  createKlaimSchema,
  updateStatusKlaimSchema,
  getKlaimByIdSchema,
  getKlaimByDonasiIdSchema,
} from '../schemas/klaim.schema';
import {
  createKlaim,
  updateStatusKlaim,
  getKlaimByDonasi,
  getKlaimByPenerima,
} from '../controllers/klaim.controller';

const router = Router();

router.post(
  '/:donasi_id',
  verifyToken,
  authorizeRole(['penerima']),
  validateParams(getKlaimByDonasiIdSchema),
  validateBody(createKlaimSchema),
  createKlaim,
);

router.put(
  '/:id',
  verifyToken,
  authorizeRole(['penerima']),
  validateParams(getKlaimByIdSchema),
  validateBody(updateStatusKlaimSchema),
  updateStatusKlaim,
);

router.get(
  '/donasi/:donasi_id',
  verifyToken,
  authorizeRole(['penerima', 'penyalur']),
  validateParams(getKlaimByDonasiIdSchema),
  getKlaimByDonasi,
);

router.get(
  '/penerima/:id',
  verifyToken,
  authorizeRole(['penerima']),
  validateParams(getKlaimByIdSchema),
  getKlaimByPenerima,
);

export default router;
