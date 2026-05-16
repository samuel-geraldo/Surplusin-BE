import { Router } from 'express';
import {
  validateBody,
  validateParams,
} from '../middlewares/validation.middleware';
import { verifyToken, authorizeRole } from '../middlewares/auth.middleware';
import {
  updateStatusKlaimSchema,
  klaimIdSchema,
} from '../schemas/klaim.schema';
import {
  createKlaim,
  getKlaimByDonasi,
  updateStatusKlaim,
} from '../controllers/klaim.controller';

const router = Router();

router.post(
  '/:donasi_id',
  verifyToken,
  authorizeRole(['penerima']),
  createKlaim,
);

router.put(
  '/:id',
  verifyToken,
  authorizeRole(['penerima']),
  validateParams(klaimIdSchema),
  validateBody(updateStatusKlaimSchema),
  updateStatusKlaim,
);

router.get(
  '/search/:donasi_id',
  verifyToken,
  authorizeRole(['penerima']),
  getKlaimByDonasi,
);

export default router;
