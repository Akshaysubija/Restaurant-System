// payment controller //
import Payment from '../models/Payment.js';
import User from '../models/User.js';

export const createPayment = async (req, res) => {
  try {
    const {
      amount,
      method,
      cardNumber,
      cardHolderName,
      expiryDate,
      upiId,
    } = req.body;

    const userId = req.user._id;

    // Basic validation //
    if (!amount || !method) {
      return res.status(400).json({ message: 'Amount and method are required.' });
    }

    // Additional validation for cards //
    if ((method === 'Credit Card' || method === 'Debit Card') &&
        (!cardNumber || !cardHolderName || !expiryDate)) {
      return res.status(400).json({
        message: 'Card number, holder name, and expiry date are required for card payments.'
      });
    }

    // Additional validation for UPI //
    if (method === 'UPI' && !upiId) {
      return res.status(400).json({ message: 'UPI ID is required for UPI payments.' });
    }

    const newPayment = new Payment({
      user: userId,
      amount,
      method,
      cardNumber,
      cardHolderName,
      expiryDate,
      upiId,
      paymentStatus: 'Paid',
    });

    await newPayment.save();

    res.status(201).json({
      message: 'Payment successful!',
      payment: newPayment
    });

  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: 'Server error while creating payment' });
  }
};

export const getUserPayments = async (req, res) => {
  try {
    const userId = req.user._id;

    const payments = await Payment.find({ user: userId })
      .populate('user', 'name email');

    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Server error while fetching payments' });
  }
};



