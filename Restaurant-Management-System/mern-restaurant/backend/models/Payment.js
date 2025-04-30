// payment model //
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: false,
  },
  amount: {
    type: Number,
    required: true,
  },
  method: {
    type: String,
    enum: ['Credit Card', 'Debit Card', 'UPI'],
    required: true,
  },
  cardNumber: {
    type: String,
    required: function () {
      return this.method === 'Credit Card' || this.method === 'Debit Card';
    },
  },
  cardHolderName: {
    type: String,
    required: function () {
      return this.method === 'Credit Card' || this.method === 'Debit Card';
    },
  },
  expiryDate: {
    type: String,
    required: function () {
      return this.method === 'Credit Card' || this.method === 'Debit Card';
    },
  },
  upiId: {
    type: String,
    required: function () {
      return this.method === 'UPI';
    },
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending',
  },
  invoiceUrl: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;




