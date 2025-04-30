// payment routes //
import express from 'express';
import { createPayment, getUserPayments } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a payment //
router.post('/', protect, createPayment);


// Get logged-in user's payment history //
router.get('/', protect, getUserPayments);

export default router;


