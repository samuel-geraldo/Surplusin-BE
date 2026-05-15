import { Router } from 'express';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middlewares/validation.middleware';
import { verifyToken, authorizeRole } from '../middlewares/auth.middleware';
import {
  createDonasiSchema,
  getDonasiByIdSchema,
  getDonasiByNamaSchema,
  getDonasiByKategoriSchema,
} from '../schemas/donasi.schema';
import {
  createDonasi,
  getAllDonasi,
  getDonasiById,
  getDonasiByNama,
  getDonasiByKategori,
  deleteDonasi,
  getDetailItemDonasi
} from '../controllers/donasi.controller';

const router = Router();

router.get('/', verifyToken, getAllDonasi);
router.get(
  '/search',
  verifyToken,
  validateQuery(getDonasiByNamaSchema),
  getDonasiByNama
)
router.get(
  '/kategori',
  verifyToken,
  validateQuery(getDonasiByKategoriSchema),
  getDonasiByKategori
)
router.get('/detail/:id', verifyToken, getDetailItemDonasi)

router.get('/:id', verifyToken, validateParams(getDonasiByIdSchema), getDonasiById);

router.post(
  '/tambah',
  verifyToken,
  authorizeRole(['penyalur']),
  validateBody(createDonasiSchema),
  createDonasi
)
router.delete('/:id', verifyToken, authorizeRole(['penyalur']), validateParams(getDonasiByIdSchema), deleteDonasi);
export default router;
