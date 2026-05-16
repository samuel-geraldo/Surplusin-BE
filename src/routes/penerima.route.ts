import { Router } from 'express';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middlewares/validation.middleware';
import { verifyToken, authorizeRole } from '../middlewares/auth.middleware';
import {
  updatePenerimaSchema,
  createPenerimaSchema,
  getPenerimaByIdSchema,
} from '../schemas/penerima.schema';
import {
  getAllPenerima,
  getPenerimaById,
  createPenerima,
  updatePenerima,
  deletePenerima,
  getNearbyDonasiController,
} from '../controllers/penerima.controller';

const router = Router();

router.get('/', verifyToken, getAllPenerima);
router.get(
  '/nearby',
  verifyToken,
  authorizeRole(['penerima']),
  getNearbyDonasiController,
);
router.get(
  '/:id',
  verifyToken,
  validateParams(getPenerimaByIdSchema),
  getPenerimaById,
);
router.post(
  '/',
  verifyToken,
  authorizeRole(['penerima']),
  validateBody(createPenerimaSchema),
  createPenerima,
);

router.put(
  '/:id',
  verifyToken,
  authorizeRole(['penerima']),
  validateParams(getPenerimaByIdSchema),
  validateBody(updatePenerimaSchema),
  updatePenerima,
);

router.delete(
  '/:id',
  verifyToken,
  authorizeRole(['penerima']),
  validateParams(getPenerimaByIdSchema),
  deletePenerima,
);

export default router;
