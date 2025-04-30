
// controllers/chatbotController.js //
import Order from '../models/Order.js';
import Menu from '../models/Menu.js';
import Reservation from '../models/Reservation.js'; 

const handleChat = async (req, res) => {
  const { message, userId } = req.body;
  const lowerMessage = message.toLowerCase();

  try {
    if (lowerMessage.includes('order') || lowerMessage.includes('status')) {
      const order = await Order.findOne({ user: userId }).sort({ createdAt: -1 });
      if (!order) {
        return res.json({
          response: "🛒 You don't have any recent orders.",
          suggestions: ['Show menu', 'Popular items'],
        });
      }

      return res.json({
        response: `📦 Your last order status: ${order.status}. Delivery status: ${order.deliveryStatus || 'Not Assigned'}.`,
        suggestions: ['Track another order', 'Show menu'],
      });
    }

    if (lowerMessage.includes('menu') || lowerMessage.includes('today')) {
      const menuItems = await Menu.find().limit(5);
      return res.json({
        response: `🍽️ Here are some menu items: ${menuItems.map(item => item.name).join(', ')}`,
        suggestions: ['More items', 'Popular items', 'Place order'],
      });
    }

    if (lowerMessage.includes('popular') || lowerMessage.includes('suggest') || lowerMessage.includes('best')) {
      const orders = await Order.find().populate('items.menuItem');
      const countMap = {};

      for (const order of orders) {
        for (const i of order.items) {
          if (i.menuItem && i.menuItem.name) {
            const name = i.menuItem.name;
            countMap[name] = (countMap[name] || 0) + 1;
          }
        }
      }

      const popularItems = Object.entries(countMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([item]) => item);

      if (popularItems.length === 0) {
        return res.json({
          response: "😔 No popular items found yet. Be the first to order!",
          suggestions: ['Show menu', 'Place an order'],
        });
      }

      return res.json({
        response: `🔥 Popular menu items: ${popularItems.join(', ')}`,
        suggestions: ['Order now', 'View full menu'],
      });
    }

    if (lowerMessage.includes('reservation') || lowerMessage.includes('book') || lowerMessage.includes('table')) {
      return res.json({
        response: "🪑 To make a reservation, please visit our Reservation page or let me know the date, time, and party size!",
        suggestions: ['Show Reservation Page', 'Reservation help'],
      });
    }

    
    return res.json({
      response: "🤔 Sorry, I didn't understand that. You can ask about your orders, menu, popular dishes, or reservations.",
      suggestions: ['Show menu', 'Track my order', 'Suggest food', 'Make a reservation'],
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      response: '⚠️ Internal server error. Please try again later.',
      suggestions: ['Try again', 'Contact support'],
    });
  }
};

export { handleChat };
