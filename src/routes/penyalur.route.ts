import { Router } from 'express';
import {
  validateBody,
  validateParams,
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
  getDataPenyalurByJWT,
} from '../controllers/penyalur.controller';

const router = Router();

/**
 * @openapi
 * /api/penyalur:
 *   get:
 *     tags: [Penyalur]
 *     summary: Mengambil semua data penyalur
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data penyalur
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', verifyToken, getAllPenyalur);

/**
 * @openapi
 * /api/penyalur/data:
 *   get:
 *     tags: [Penyalur]
 *     summary: Mengambil data penyalur berdasarkan token JWT
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data penyalur
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
  '/data',
  verifyToken,
  authorizeRole(['penyalur']),
  getDataPenyalurByJWT,
);

/**
 * @openapi
 * /api/penyalur/nearby:
 *   get:
 *     tags: [Penyalur]
 *     summary: Mengambil jumlah penerima terdekat per kategori
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil jumlah penerima terdekat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 Panti Asuhan: 5
 *                 Yayasan Sosial: 3
 *                 Panti Jompo: 1
 *                 Lainnya: 0
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
  '/nearby',
  verifyToken,
  authorizeRole(['penyalur']),
  getNearbyPenerimaController,
);

/**
 * @openapi
 * /api/penyalur/{id}:
 *   get:
 *     tags: [Penyalur]
 *     summary: Mengambil data penyalur berdasarkan ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID penyalur
 *     responses:
 *       200:
 *         description: Berhasil mengambil data penyalur
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Penyalur tidak ditemukan
 *       500:
 *         description: Server error
 */
router.get(
  '/:id',
  verifyToken,
  validateParams(getPenyalurByIdSchema),
  getPenyalurById,
);

/**
 * @openapi
 * /api/penyalur:
 *   post:
 *     tags: [Penyalur]
 *     summary: Membuat data penyalur baru
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nama_toko, kategori, nomor_whatsapp, alamat, patokan]
 *             properties:
 *               nama_toko:
 *                 type: string
 *               kategori:
 *                 type: string
 *                 enum: [Makanan Siap Saji, Roti & Pastry, Jajanan & Kue]
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
 *         description: Berhasil membuat data penyalur
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
  authorizeRole(['penyalur']),
  validateBody(createPenyalurSchema),
  createPenyalur,
);

/**
 * @openapi
 * /api/penyalur/{id}:
 *   put:
 *     tags: [Penyalur]
 *     summary: Mengubah data penyalur
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID penyalur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama_toko:
 *                 type: string
 *               kategori:
 *                 type: string
 *                 enum: [Makanan Siap Saji, Roti & Pastry, Jajanan & Kue]
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
 *         description: Berhasil mengubah data penyalur
 *       400:
 *         description: Input tidak valid
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Penyalur tidak ditemukan
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  verifyToken,
  authorizeRole(['penyalur']),
  validateParams(getPenyalurByIdSchema),
  validateBody(updatePenyalurSchema),
  updatePenyalur,
);

/**
 * @openapi
 * /api/penyalur/{id}:
 *   delete:
 *     tags: [Penyalur]
 *     summary: Menghapus data penyalur
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID penyalur
 *     responses:
 *       200:
 *         description: Berhasil menghapus data penyalur
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Penyalur tidak ditemukan
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  verifyToken,
  authorizeRole(['penyalur']),
  validateParams(getPenyalurByIdSchema),
  deletePenyalur,
);

export default router;
