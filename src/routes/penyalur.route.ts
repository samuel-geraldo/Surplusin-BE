import { Router } from 'express';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middlewares/validation.middleware';
import { verifyToken, authorizeRole } from '../middlewares/auth.middleware';
import {
  updatePenyalurSchema,
  createPenyalurSchema,
  getPenyalurByIdSchema,
} from '../schemas/penyalur.schema';
import {
  getAllPenyalur,
  getPenyalurById,
  createPenyalur,
  updatePenyalur,
  deletePenyalur,
  getNearbyPenerimaController,
} from '../controllers/penyalur.controller';

const router = Router();

router.get('/', verifyToken, getAllPenyalur);
router.get(
  '/nearby',
  verifyToken,
  authorizeRole(['penyalur']),
  getNearbyPenerimaController,
);
router.get(
  '/:id',
  verifyToken,
  validateParams(getPenyalurByIdSchema),
  getPenyalurById,
);
router.post(
  '/',
  verifyToken,
  authorizeRole(['penyalur']),
  validateBody(createPenyalurSchema),
  createPenyalur,
);

router.put(
  '/:id',
  verifyToken,
  authorizeRole(['penyalur']),
  validateParams(getPenyalurByIdSchema),
  validateBody(updatePenyalurSchema),
  updatePenyalur,
);

router.delete(
  '/:id',
  verifyToken,
  authorizeRole(['penyalur']),
  validateParams(getPenyalurByIdSchema),
  deletePenyalur,
);

export default router;
