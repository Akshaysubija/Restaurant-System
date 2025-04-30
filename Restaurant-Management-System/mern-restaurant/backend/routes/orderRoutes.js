// order routes //
import express from 'express';
import {
  placeOrder,
  getUserOrders,
  downloadInvoice,
  updateOrderItem,
  deleteOrderItem,
} from '../controllers/orderController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Place a new order //
router.post('/', protect, placeOrder);

// Get all orders for logged-in user //
router.get('/myorders', protect, getUserOrders);

// Download invoice //
router.get('/invoice/:id', protect, downloadInvoice);

// Update item quantity in an order //
router.put('/:orderId/update-item', protect, updateOrderItem);

// Delete item from an order //
router.delete('/:orderId/delete-item/:menuItemId', protect, deleteOrderItem);

export default router;



