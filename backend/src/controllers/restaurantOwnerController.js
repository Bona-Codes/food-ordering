const prisma = require('../config/db');

// Get restaurant owned by logged-in user
const getMyRestaurant = async (req, res) => {
    try {
        const owner = await prisma.restaurant_owners.findUnique({
            where: { user_id: req.user.userId }
        });

        if (!owner) return res.status(404).json({ message: 'Restaurant owner profile not found' });

        const restaurant = await prisma.restaurants.findFirst({
            where: { owner_id: owner.owner_id },
            include: { addresses: true }
        });

        if (!restaurant) return res.status(404).json({ message: 'No restaurant found' });

        res.json(restaurant);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get orders for my restaurant
const getMyOrders = async (req, res) => {
    try {
        const owner = await prisma.restaurant_owners.findUnique({
            where: { user_id: req.user.userId }
        });

        const restaurant = await prisma.restaurants.findFirst({
            where: { owner_id: owner.owner_id }
        });

        if (!restaurant) return res.status(404).json({ message: 'No restaurant found' });

        const orders = await prisma.orders.findMany({
            where: { restaurant_id: restaurant.restaurant_id },
            include: {
                customers: { include: { users: true } },
                order_items: { include: { menu_items: true } }
            },
            orderBy: { order_date: 'desc' }
        });

        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { order_status } = req.body;

        const order = await prisma.orders.update({
            where: { order_id: parseInt(id) },
            data: { order_status }
        });

        res.json({ message: 'Order status updated', order });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get my menu items
const getMyMenu = async (req, res) => {
    try {
        const owner = await prisma.restaurant_owners.findUnique({
            where: { user_id: req.user.userId }
        });

        const restaurant = await prisma.restaurants.findFirst({
            where: { owner_id: owner.owner_id }
        });

        if (!restaurant) return res.status(404).json({ message: 'No restaurant found' });

        const items = await prisma.menu_items.findMany({
            where: { restaurant_id: restaurant.restaurant_id },
            orderBy: { created_at: 'desc' }
        });

        res.json(items);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Add menu item
const addMenuItem = async (req, res) => {
    try {
        const { name, description, price, preparation_time } = req.body;

        const owner = await prisma.restaurant_owners.findUnique({
            where: { user_id: req.user.userId }
        });

        const restaurant = await prisma.restaurants.findFirst({
            where: { owner_id: owner.owner_id }
        });

        if (!restaurant) return res.status(404).json({ message: 'No restaurant found' });

        const item = await prisma.menu_items.create({
            data: {
                restaurant_id: restaurant.restaurant_id,
                name,
                description,
                price: parseFloat(price),
                preparation_time: parseInt(preparation_time) || 15,
                availability_status: true
            }
        });

        res.status(201).json({ message: 'Menu item added', item });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update menu item
const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, preparation_time, availability_status } = req.body;

        const item = await prisma.menu_items.update({
            where: { menu_item_id: parseInt(id) },
            data: {
                name,
                description,
                price: parseFloat(price),
                preparation_time: parseInt(preparation_time),
                availability_status
            }
        });

        res.json({ message: 'Menu item updated', item });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete menu item
const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.menu_items.delete({
            where: { menu_item_id: parseInt(id) }
        });

        res.json({ message: 'Menu item deleted' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getMyRestaurant,
    getMyOrders,
    updateOrderStatus,
    getMyMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
};