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
  deleteDonasiSchema
} from '../schemas/donasi.schema';
import {
  createDonasi,
  getAllDonasi,
  getDonasiById,
  getDonasiByNama,
  getDonasiByKategori,
  deleteDonasi,
  getDetailItemDonasi,
  getRiwayatPenerima,
  getRiwayatPenyerahan,
  getStatistikDonasi
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
router.get('/riwayat-penerima', verifyToken, authorizeRole(['penerima']), getRiwayatPenerima)
router.get('/riwayat-penyerahan', verifyToken, authorizeRole(['penyalur']), getRiwayatPenyerahan)
router.get('/statistik', verifyToken, getStatistikDonasi)

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
