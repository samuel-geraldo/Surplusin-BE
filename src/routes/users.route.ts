import { Router } from 'express';
import {
  validateBody,
  validateParams,
} from '../middlewares/validation.middleware';
import { verifyToken, authorizeRole } from '../middlewares/auth.middleware';
import { updateUserSchema, userIdSchema } from '../schemas/users.schema';
import {
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/users.controller';

const router = Router();

router.get('/', verifyToken, getAllUser);
router.get('/:id', verifyToken, validateParams(userIdSchema), getUserById);
router.put(
  '/:id',
  verifyToken,
  validateParams(userIdSchema),
  validateBody(updateUserSchema),
  updateUser,
);

router.delete('/:id', verifyToken, validateParams(userIdSchema), deleteUser);

export default router;
