// resevation controller //
import Reservation from '../models/Reservation.js';

const createReservation = async (req, res) => {
  const { name, phone, date, time, partySize } = req.body;

  const reservation = await Reservation.create({
    user: req.user._id,
    name,
    phone,
    date,
    time,
    partySize
  });

  res.status(201).json(reservation);
};

const getMyReservations = async (req, res) => {
  const reservations = await Reservation.find({ user: req.user._id });
  res.json(reservations);
};

const getAllReservations = async (req, res) => {
  const reservations = await Reservation.find().populate('user', 'name email');
  res.json(reservations);
};

const updateReservationStatus = async (req, res) => {
  const { status } = req.body;
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    return res.status(404).json({ message: 'Reservation not found' });
  }

  reservation.status = status;
  await reservation.save();

  res.json({ message: 'Reservation updated', reservation });
};

export { createReservation, getMyReservations, getAllReservations, updateReservationStatus };




