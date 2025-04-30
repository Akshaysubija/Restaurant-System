// payment page //
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Credit Card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('User not authenticated');
        const res = await axios.get('http://localhost:5000/api/payments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(res.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch payments');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const paymentData = {
      amount,
      method,
      cardNumber: method !== 'UPI' ? cardNumber : undefined,
      cardHolderName: method !== 'UPI' ? cardHolderName : undefined,
      expiryDate: method !== 'UPI' ? expiryDate : undefined,
      upiId: method === 'UPI' ? upiId : undefined,
    };

    try {
      const res = await axios.post('http://localhost:5000/api/payments', paymentData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(
        `✅ Payment of ₹${res.data.payment.amount} successful via ${res.data.payment.method}`
      );
      setPayments([...payments, res.data.payment]);
      // Reset fields
      setAmount('');
      setCardNumber('');
      setCardHolderName('');
      setExpiryDate('');
      setUpiId('');
    } catch (err) {
      toast.error('Payment failed. Try again.');
    }
  };

  return (
    <div className="payment-container">
      <ToastContainer />
      
      {/* Payment Records */}
      <div className="bg-white bg-opacity-90 p-6 rounded shadow max-w-4xl mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4">💳 Payment Records</h2>
        
        {loading ? (
          <p>Loading payments...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : payments.length === 0 ? (
          <p>No payment records found.</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Invoice</th>
                <th className="border px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td className="border px-4 py-2">{p.user?.name || 'N/A'}</td>
                  <td className="border px-4 py-2">₹ {p.amount}</td>
                  <td className="border px-4 py-2">
                    {p.paymentStatus === 'Paid' ? '✅ Paid' : '❌ Pending'}
                  </td>
                  <td className="border px-4 py-2">
                    {p.invoiceUrl ? (
                      <a href={p.invoiceUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">Download Invoice</a>
                    ) : (
                      'No Invoice Available'
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(p.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Payment Form */}
      <div className="bg-white bg-opacity-90 p-6 rounded shadow max-w-4xl mx-auto mt-10">
        <h2 className="text-xl font-semibold mb-4">🧾 Bill Summary</h2>
        <p className="mb-4">Total Amount Due:</p>
        <input
          type="number"
          placeholder="Enter Amount"
          className="input-field"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="mt-4">
          <label className="font-semibold">Select Payment Method:</label>
          <select
            className="input-field"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option>Credit Card</option>
            <option>Debit Card</option>
            <option>UPI</option>
          </select>
        </div>

        {method !== 'UPI' ? (
          <>
            <input
              type="text"
              className="input-field"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
            <input
              type="text"
              className="input-field"
              placeholder="Card Holder Name"
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value)}
            />
            <input
              type="month"
              className="input-field"
              placeholder="Expiry Date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </>
        ) : (
          <input
            type="text"
            className="input-field"
            placeholder="Enter UPI ID"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
          />
        )}

        <button
          onClick={handlePaymentSubmit}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default PaymentsPage;






