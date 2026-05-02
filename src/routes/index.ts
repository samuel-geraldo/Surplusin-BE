import { Router } from 'express';
import authRoute from './auth.route.js';
import usersRoute from './users.route.js';
import penyalurRoute from './penyalur.route.js';
import penerimaRoute from './penerima.route.js';

const router = Router();

router.use('/auth', authRoute);
router.use('/users', usersRoute);
router.use('/penyalur', penyalurRoute);
router.use('/penerima', penerimaRoute);

export default router;
