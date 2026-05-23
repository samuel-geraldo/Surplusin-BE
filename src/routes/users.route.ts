import { Router } from 'express';
import {
  validateBody,
  validateParams,
} from '../middlewares/validation.middleware.js';
import { verifyToken, authorizeRole } from '../middlewares/auth.middleware.js';
import { updateUserSchema, userIdSchema } from '../schemas/users.schema.js';
import {
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/users.controller.js';

const router = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Mengambil semua data user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data user
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', verifyToken, getAllUser);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Mengambil data user berdasarkan ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^\\d+$"
 *         description: ID user
 *     responses:
 *       200:
 *         description: Berhasil mengambil data user
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Server error
 */
router.get('/:id', verifyToken, validateParams(userIdSchema), getUserById);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Mengubah data user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^\\d+$"
 *         description: ID user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Berhasil mengubah data user
 *       400:
 *         description: Input tidak valid
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  verifyToken,
  validateParams(userIdSchema),
  validateBody(updateUserSchema),
  updateUser,
);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Menghapus data user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^\\d+$"
 *         description: ID user
 *     responses:
 *       200:
 *         description: Berhasil menghapus data user
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Server error
 */
router.delete('/:id', verifyToken, validateParams(userIdSchema), deleteUser);

export default router;
