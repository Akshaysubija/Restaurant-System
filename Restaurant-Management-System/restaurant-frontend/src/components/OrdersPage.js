// order page //
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [updatedQuantities, setUpdatedQuantities] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  
  useEffect(() => {
    const savedDarkMode = JSON.parse(localStorage.getItem('darkMode'));
    if (savedDarkMode) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    fetchOrders();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', true);
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', false);
    }
  }, [darkMode]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/orders/myorders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const handlePayNow = () => {
    navigate('/payments', { state: { totalAmount: calculateTotalAmount() } });
  };

  const handleQuantityChange = (orderId, menuItemId, quantity) => {
    setUpdatedQuantities((prev) => ({
      ...prev,
      [`${orderId}-${menuItemId}`]: quantity,
    }));
  };

  const updateQuantity = async (orderId, menuItemId, originalQuantity) => {
    const token = localStorage.getItem('token');
    const updatedQuantity = updatedQuantities[`${orderId}-${menuItemId}`] || originalQuantity;

    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/update-item`,
        { orderId, menuItemId, quantity: Number(updatedQuantity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error('Error updating quantity:', err.response?.data || err.message);
    }
  };

  const handleDeleteItem = async (orderId, menuItemId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(
        `http://localhost:5000/api/orders/${orderId}/delete-item/${menuItemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error('Error deleting item:', err.response?.data || err.message);
    }
  };

  const calculateTotalAmount = () => {
    return orders.reduce((total, order) => total + (order.totalPrice || 0), 0);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const groupOrdersByStatus = () => {
    const grouped = { Pending: [], Paid: [] };
    orders.forEach((order) => {
      if (order.status === 'Pending') grouped.Pending.push(order);
      if (order.status === 'Paid') grouped.Paid.push(order);
    });
    return grouped;
  };

  const groupedOrders = groupOrdersByStatus();

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} min-h-screen py-10 px-6`}>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold">Your Orders</h2>
          <button
            onClick={toggleDarkMode}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        {['Pending', 'Paid'].map((status) => (
          <div key={status}>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">{status} Orders</h3>
            {groupedOrders[status].length === 0 ? (
              <p className="text-center text-gray-500">No {status} orders found.</p>
            ) : (
              groupedOrders[status].map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow p-5 mb-6">
                  <div className="mb-4 border-b pb-3 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Order ID: <span className="font-medium">{order._id}</span></p>
                      <p className="text-sm text-gray-600">Date: {new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <p className="text-lg font-semibold text-green-700">₹{order.totalPrice}</p>
                  </div>

                  <ul className="space-y-4">
                    {order.items.map((item) => (
                      <li key={item._id} className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          {item.menuItem?.image && (
                            <img src={item.menuItem.image} alt={item.menuItem.name} className="w-14 h-14 rounded object-cover" />
                          )}
                          <div>
                            <h4 className="font-medium">{item.menuItem?.name}</h4>
                            <p className="text-sm text-gray-500">₹{item.price}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            value={updatedQuantities[`${order._id}-${item.menuItem._id}`] ?? item.quantity}
                            onChange={(e) => handleQuantityChange(order._id, item.menuItem._id, e.target.value)}
                            className="w-16 text-sm px-2 py-1 border rounded-md"
                          />
                          <button
                            onClick={() => updateQuantity(order._id, item.menuItem._id, item.quantity)}
                            className="text-xs px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded shadow"
                          >
                            ✏️ Update
                          </button>
                          <button
                            onClick={() => handleDeleteItem(order._id, item.menuItem._id)}
                            className="text-xs px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded shadow"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        ))}

        {orders.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-xl font-semibold mb-4">Total Amount: ₹{calculateTotalAmount()}</p>
            <button
              onClick={handlePayNow}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg text-sm shadow transition"
            >
              Pay Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
