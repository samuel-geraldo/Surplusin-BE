import { Router } from 'express';
import {
  validateBody,
  validateParams,
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
  getPenerimaByJWT,
} from '../controllers/penerima.controller';

const router = Router();

/**
 * @openapi
 * /api/penerima:
 *   get:
 *     tags: [Penerima]
 *     summary: Mengambil semua data penerima
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data penerima
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', verifyToken, getAllPenerima);

/**
 * @openapi
 * /api/penerima/data:
 *   get:
 *     tags: [Penerima]
 *     summary: Mengambil data penerima berdasarkan token JWT
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data penerima
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Penerima tidak ditemukan
 *       500:
 *         description: Server error
 */
router.get('/data', verifyToken, authorizeRole(['penerima']), getPenerimaByJWT);

/**
 * @openapi
 * /api/penerima/nearby:
 *   get:
 *     tags: [Penerima]
 *     summary: Mengambil donasi terdekat dari lokasi penerima
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil donasi terdekat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_donasi:
 *                   type: integer
 *                 donasi:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       nama:
 *                         type: string
 *                       kategori:
 *                         type: string
 *                       jumlah:
 *                         type: integer
 *                       satuan:
 *                         type: string
 *                       expired_at:
 *                         type: string
 *                         format: date-time
 *                       nama_toko:
 *                         type: string
 *                       alamat:
 *                         type: string
 *                       jarak_km:
 *                         type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Penerima tidak ditemukan
 *       500:
 *         description: Server error
 */
router.get(
  '/nearby',
  verifyToken,
  authorizeRole(['penerima']),
  getNearbyDonasiController,
);

/**
 * @openapi
 * /api/penerima/{id}:
 *   get:
 *     tags: [Penerima]
 *     summary: Mengambil data penerima berdasarkan ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID penerima
 *     responses:
 *       200:
 *         description: Berhasil mengambil data penerima
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Penerima tidak ditemukan
 *       500:
 *         description: Server error
 */
router.get(
  '/:id',
  verifyToken,
  validateParams(getPenerimaByIdSchema),
  getPenerimaById,
);

/**
 * @openapi
 * /api/penerima:
 *   post:
 *     tags: [Penerima]
 *     summary: Membuat data penerima baru
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nama_instansi, kategori, nomor_whatsapp, alamat, latitude, longitude]
 *             properties:
 *               nama_instansi:
 *                 type: string
 *               kategori:
 *                 type: string
 *                 enum: [Panti Asuhan, Panti Jompo, Yayasan Sosial, Lainnya]
 *               nomor_whatsapp:
 *                 type: string
 *               alamat:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               patokan:
 *                 type: string
 *     responses:
 *       200:
 *         description: Berhasil membuat data penerima
 *       400:
 *         description: Input tidak valid
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  verifyToken,
  authorizeRole(['penerima']),
  validateBody(createPenerimaSchema),
  createPenerima,
);

/**
 * @openapi
 * /api/penerima/me:
 *   put:
 *     tags: [Penerima]
 *     summary: Mengubah data penerima
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_instansi:
 *                 type: string
 *               kategori:
 *                 type: string
 *                 enum: [Panti Asuhan, Panti Jompo, Yayasan Sosial, Lainnya]
 *               nomor_whatsapp:
 *                 type: string
 *               alamat:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               patokan:
 *                 type: string
 *     responses:
 *       200:
 *         description: Berhasil mengubah data penerima
 *       400:
 *         description: Input tidak valid
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Penerima tidak ditemukan
 *       500:
 *         description: Server error
 */
router.put(
  '/me',
  verifyToken,
  authorizeRole(['penerima']),
  validateBody(updatePenerimaSchema),
  updatePenerima,
);

/**
 * @openapi
 * /api/penerima/{id}:
 *   delete:
 *     tags: [Penerima]
 *     summary: Menghapus data penerima
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID penerima
 *     responses:
 *       200:
 *         description: Berhasil menghapus data penerima
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Penerima tidak ditemukan
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  verifyToken,
  authorizeRole(['penerima']),
  validateParams(getPenerimaByIdSchema),
  deletePenerima,
);

export default router;
