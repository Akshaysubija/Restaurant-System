// reservation routes //
import express from 'express';
import { createReservation, getMyReservations, getAllReservations, updateReservationStatus } from '../controllers/reservationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes //
router.post('/', protect, createReservation);
router.get('/my', protect, getMyReservations);

// Admin routes //
router.get('/', protect, admin, getAllReservations);
router.put('/:id/status', protect, admin, updateReservationStatus);

export default router;




