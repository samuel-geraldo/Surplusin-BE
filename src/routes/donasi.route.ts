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
  deleteDonasiSchema,
} from '../schemas/donasi.schema';
import {
  createDonasi,
  getAllDonasi,
  getDonasiById,
  getDonasiByNama,
  getDonasiByKategori,
  getDonasiPenyalurLogin,
  deleteDonasi,
  getDetailItemDonasi,
  getRiwayatPenerima,
  getRiwayatPenyerahan,
  getStatistikDonasi,
} from '../controllers/donasi.controller';

const router = Router();

/**
 * @openapi
 * /api/donasi:
 *   get:
 *     tags: [Donasi]
 *     summary: Mengambil semua data donasi
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data donasi
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', verifyToken, getAllDonasi);

/**
 * @openapi
 * /api/donasi/search:
 *   get:
 *     tags: [Donasi]
 *     summary: Mencari donasi berdasarkan nama
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nama
 *         required: true
 *         schema:
 *           type: string
 *         description: Nama donasi yang dicari
 *     responses:
 *       200:
 *         description: Berhasil mengambil data donasi
 *       400:
 *         description: Input tidak valid
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Server error
 */
router.get(
  '/search',
  verifyToken,
  validateQuery(getDonasiByNamaSchema),
  getDonasiByNama,
);

/**
 * @openapi
 * /api/donasi/kategori:
 *   get:
 *     tags: [Donasi]
 *     summary: Mengambil donasi berdasarkan kategori
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: kategori
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Makanan Siap Saji, Roti & Pastry, Jajanan & Kue]
 *         description: Kategori donasi
 *     responses:
 *       200:
 *         description: Berhasil mengambil data donasi
 *       400:
 *         description: Input tidak valid
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Server error
 */
router.get(
  '/kategori',
  verifyToken,
  validateQuery(getDonasiByKategoriSchema),
  getDonasiByKategori,
);

/**
 * @openapi
 * /api/donasi/detail/{id}:
 *   get:
 *     tags: [Donasi]
 *     summary: Mengambil detail item donasi
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID donasi
 *     responses:
 *       200:
 *         description: Berhasil mengambil detail item donasi
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Server error
 */
router.get('/detail/:id', verifyToken, getDetailItemDonasi);

/**
 * @openapi
 * /api/donasi/riwayat-penerima:
 *   get:
 *     tags: [Donasi]
 *     summary: Mengambil riwayat donasi penerima
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil riwayat donasi penerima
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Server error
 */
router.get(
  '/riwayat-penerima',
  verifyToken,
  authorizeRole(['penerima']),
  getRiwayatPenerima,
);

/**
 * @openapi
 * /api/donasi/riwayat-penyerahan:
 *   get:
 *     tags: [Donasi]
 *     summary: Mengambil riwayat penyerahan donasi
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil riwayat penyerahan donasi
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Server error
 */
router.get(
  '/riwayat-penyerahan',
  verifyToken,
  authorizeRole(['penyalur']),
  getRiwayatPenyerahan,
);

/**
 * @openapi
 * /api/donasi/statistik:
 *   get:
 *     tags: [Donasi]
 *     summary: Mengambil statistik donasi
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil statistik donasi
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/statistik', verifyToken, getStatistikDonasi);

/**
 * @openapi
 * /api/donasi/penyalur-login:
 *   get:
 *     tags: [Donasi]
 *     summary: Mengambil donasi milik penyalur yang sedang login
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data donasi penyalur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nama:
 *                     type: string
 *                   kategori:
 *                     type: string
 *                   jumlah:
 *                     type: integer
 *                   satuan:
 *                     type: string
 *                   item_detail:
 *                     type: string
 *                   expired_at:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Penyalur tidak ditemukan
 *       500:
 *         description: Server error
 */
router.get(
  '/penyalur-login',
  verifyToken,
  authorizeRole(['penyalur']),
  getDonasiPenyalurLogin,
);

/**
 * @openapi
 * /api/donasi/{id}:
 *   get:
 *     tags: [Donasi]
 *     summary: Mengambil donasi berdasarkan ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID donasi
 *     responses:
 *       200:
 *         description: Berhasil mengambil data donasi
 *       400:
 *         description: Input tidak valid
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Server error
 */
router.get(
  '/:id',
  verifyToken,
  validateParams(getDonasiByIdSchema),
  getDonasiById,
);

/**
 * @openapi
 * /api/donasi/tambah:
 *   post:
 *     tags: [Donasi]
 *     summary: Membuat donasi baru
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nama, kategori, jumlah, satuan]
 *             properties:
 *               nama:
 *                 type: string
 *               kategori:
 *                 type: string
 *                 enum: [Makanan Siap Saji, Roti & Pastry, Jajanan & Kue]
 *               jumlah:
 *                 type: number
 *                 minimum: 1
 *               satuan:
 *                 type: string
 *                 enum: [Pcs, Kg, Porsi, Paket]
 *               item_detail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Berhasil membuat data donasi
 *       400:
 *         description: Input tidak valid
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Server error
 */
router.post(
  '/tambah',
  verifyToken,
  authorizeRole(['penyalur']),
  validateBody(createDonasiSchema),
  createDonasi,
);

/**
 * @openapi
 * /api/donasi/{id}:
 *   delete:
 *     tags: [Donasi]
 *     summary: Menghapus donasi berdasarkan ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID donasi
 *     responses:
 *       200:
 *         description: Berhasil menghapus data donasi
 *       400:
 *         description: Input tidak valid
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  verifyToken,
  authorizeRole(['penyalur']),
  validateParams(getDonasiByIdSchema),
  deleteDonasi,
);
export default router;
