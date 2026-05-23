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
  getAllKlaim,
  getKlaimAktifPenyalur,
} from '../controllers/klaim.controller';

const router = Router();

/**
 * @openapi
 * /api/klaim:
 *   get:
 *     tags: [Klaim]
 *     summary: Mengambil semua data klaim
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data klaim
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', verifyToken, getAllKlaim);

/**
 * @openapi
 * /api/klaim/penyalur/aktif:
 *   get:
 *     tags: [Klaim]
 *     summary: Mengambil klaim aktif untuk donasi milik penyalur login
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil klaim aktif penyalur
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
  '/penyalur/aktif',
  verifyToken,
  authorizeRole(['penyalur']),
  getKlaimAktifPenyalur,
);

/**
 * @openapi
 * /api/klaim/{donasi_id}:
 *   post:
 *     tags: [Klaim]
 *     summary: Membuat klaim donasi
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: donasi_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID donasi yang akan diklaim
 *     responses:
 *       201:
 *         description: Berhasil membuat klaim donasi
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Data tidak ditemukan
 *       409:
 *         description: Donasi sudah diklaim
 *       500:
 *         description: Server error
 */
router.post(
  '/:donasi_id',
  verifyToken,
  authorizeRole(['penerima']),
  createKlaim,
);

/**
 * @openapi
 * /api/klaim/{id}:
 *   put:
 *     tags: [Klaim]
 *     summary: Mengubah status klaim
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^\\d+$"
 *         description: ID klaim
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [on_the_way, arrived, completed]
 *     responses:
 *       200:
 *         description: Berhasil mengubah status klaim
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
router.put(
  '/:id',
  verifyToken,
  authorizeRole(['penerima']),
  validateParams(klaimIdSchema),
  validateBody(updateStatusKlaimSchema),
  updateStatusKlaim,
);

/**
 * @openapi
 * /api/klaim/search/{donasi_id}:
 *   get:
 *     tags: [Klaim]
 *     summary: Mengambil klaim berdasarkan ID donasi
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: donasi_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID donasi
 *     responses:
 *       200:
 *         description: Berhasil mengambil data klaim
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get(
  '/search/:donasi_id',
  verifyToken,
  authorizeRole(['penerima']),
  getKlaimByDonasi,
);

export default router;
