// order controller //
import Order from '../models/Order.js';
import { generateInvoice } from '../invoices/generateInvoice.js'; 

import path from 'path';
import { fileURLToPath } from 'url';

// Place a new order //
export const placeOrder = async (req, res) => {
  try {
    const order = await Order.create({ ...req.body, user: req.user.id });
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all orders for the logged-in user //
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.menuItem');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};


//  Get single order by ID //
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.menuItem');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};

// Download invoice for a specific order //
export const downloadInvoice = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate('items.menuItem');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const invoicePath = path.join(__dirname, `../invoices/invoice-${orderId}.pdf`);

    await generateInvoice(order, invoicePath);
    res.download(invoicePath, `invoice-${orderId}.pdf`);
  } catch (err) {
    res.status(500).json({ message: 'Error generating invoice', error: err.message });
  }
};

// Update quantity of an item in an existing order //
export const updateOrderItem = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { menuItemId, quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const item = order.items.find(i => i.menuItem.toString() === menuItemId);
    if (!item) return res.status(404).json({ message: 'Item not found in order' });

    item.pricePerUnit = item.pricePerUnit || item.price / item.quantity;

    item.quantity = quantity;
    item.price = item.pricePerUnit * quantity;

    order.totalPrice = order.items.reduce((acc, i) => acc + i.price, 0);

    await order.save();

    res.status(200).json({ message: 'Order updated successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Error updating order item', error: err.message });
  }
};


// Delete an item from an order //
export const deleteOrderItem = async (req, res) => {
  try {
    const { orderId, menuItemId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.items = order.items.filter(item => item.menuItem.toString() !== menuItemId);

    // Check if any items remain //
    if (order.items.length === 0) {
      await Order.findByIdAndDelete(orderId); 
      return res.status(200).json({ message: 'Item deleted and order removed (empty)' });
    }

    // Recalculate total price //
    order.totalPrice = order.items.reduce((acc, item) => acc + item.price, 0);

    await order.save();

    res.status(200).json({ message: 'Item deleted successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting order item', error: err.message });
  }
};




