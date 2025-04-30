// routes/menuRoutes.js //
import express from 'express';
import {
  createMenuItem,
  getMenu,
  deleteMenuItem
} from '../controllers/menuController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createMenuItem)
  .get(getMenu);

router.route('/:id')
  .delete(protect, deleteMenuItem);

export default router;
