import { Router } from 'express';
import authRoute from './auth.route.js';
import usersRoute from './users.route.js';
import penyalurRoute from './penyalur.route.js';
import penerimaRoute from './penerima.route.js';
import donasiRoute from './donasi.route.js';
import klaimRoute from './klaim.route.js';

const router = Router();

router.use('/auth', authRoute);
router.use('/users', usersRoute);
router.use('/penyalur', penyalurRoute);
router.use('/penerima', penerimaRoute);
router.use('/donasi', donasiRoute);
router.use('/klaim', klaimRoute);

export default router;
