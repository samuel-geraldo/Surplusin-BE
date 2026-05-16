import { Router } from 'express';
import {
  validateBody,
  validateParams,
} from '../middlewares/validation.middleware';
import { verifyToken, authorizeRole } from '../middlewares/auth.middleware';
import {
  createKlaim,
  getKlaimByDonasi,
} from '../controllers/klaim.controller';

const router = Router();

router.post(
  '/:donasi_id',
  verifyToken,
  authorizeRole(['penerima']),
  createKlaim,
);
router.get(
  '/search/:donasi_id',
  verifyToken,
  authorizeRole(['penerima']),
  getKlaimByDonasi,
)

export default router;
