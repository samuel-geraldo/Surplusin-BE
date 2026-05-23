import { Router } from 'express';
import { validateBody } from '../middlewares/validation.middleware.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import {
  register,
  login,
  logout,
  googleLogin,
  callbackGoogle,
} from '../controllers/auth.controller.js';

const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrasi user baru
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, selectedRole]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               selectedRole:
 *                 type: string
 *                 enum: [penyalur, penerima]
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *       400:
 *         description: Email sudah terdaftar / Validasi gagal
 */
router.post('/register', validateBody(registerSchema), register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login berhasil, mengembalikan token
 *       401:
 *         description: Email atau password salah
 */
router.post('/login', validateBody(loginSchema), login);
router.post('/logout', logout);
router.get('/google', googleLogin);
router.get('/google/callback', callbackGoogle);

export default router;
