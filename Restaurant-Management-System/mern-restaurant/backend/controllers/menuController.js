
// controllers/menuController.js //

import Menu from '../models/Menu.js';

// menu item //
export const createMenuItem = async (req, res) => {
  try {
    const { name, category, price, description, image } = req.body; // <-- fixed here

    const menu = new Menu({ name, category, price, description, image }); // now image is defined
    const createdItem = await menu.save();

    res.status(201).json(createdItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get all menu items //
export const getMenu = async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete menu item by ID //
export const deleteMenuItem = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    await menu.remove();
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
