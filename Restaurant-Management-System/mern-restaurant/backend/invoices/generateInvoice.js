// invoice creating //
import PDFDocument from 'pdfkit';
import fs from 'fs';
import Order from '../models/Order.js'; 

export const generateInvoice = async (orderId, filePath) => {
  try {
    // Fetch and populate the order with menu item details //
    const order = await Order.findById(orderId).populate('items.menuItem');

    if (!order) {
      throw new Error('Order not found');
    }

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));

    // Header //
    doc.fontSize(22).text('Restaurant Invoice', { align: 'center' });
    doc.moveDown();

    // Order Details //
    doc.fontSize(12).text(`Order ID: ${order._id}`);
    doc.text(`User ID: ${order.user}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
    doc.moveDown();

    // Ordered Items //
    doc.fontSize(14).text('Ordered Items:');
    doc.moveDown(0.5);

    if (!order.items || order.items.length === 0) {
      doc.text('No items found in this order.');
    } else {
      order.items.forEach((item, index) => {
        const itemName = item.menuItem?.name || 'Unknown Item';
        const quantity = item.quantity || 0;
        const itemPrice = item.price || 0;
        const itemTotal = itemPrice * quantity;

        doc.text(`${index + 1}. ${itemName} x ${quantity} = ₹${itemTotal}`);
      });
    }

    // Total Amount //
    doc.moveDown();
    doc.fontSize(16).text(`Total Amount: ₹${order.totalPrice}`, { align: 'right' });

    // Footer //
    doc.moveDown(2);
    doc.fontSize(10).text('Thank you for your order!', { align: 'center' });

    doc.end();
  } catch (error) {
    console.error('Invoice generation error:', error.message);
    throw error;
  }
};


