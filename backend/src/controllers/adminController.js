const prisma = require('../config/db');

// GET all orders with details
const getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.orders.findMany({
            include: {
                customers: { include: { users: true } },
                restaurants: true,
                order_items: { include: { menu_items: true } },
                payments: true
            },
            orderBy: { order_date: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// UPDATE order status
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

// GET all restaurants
const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await prisma.restaurants.findMany({
            include: {
                restaurant_owners: { include: { users: true } },
                addresses: true
            },
            orderBy: { created_at: 'desc' }
        });
        res.json(restaurants);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// APPROVE or REJECT restaurant
const updateRestaurantStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_approved, status } = req.body;

        const restaurant = await prisma.restaurants.update({
            where: { restaurant_id: parseInt(id) },
            data: { is_approved, status }
        });

        res.json({ message: 'Restaurant status updated', restaurant });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// GET all users
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.users.findMany({
            select: {
                user_id: true,
                first_name: true,
                last_name: true,
                email: true,
                role: true,
                is_active: true,
                created_at: true
            },
            orderBy: { created_at: 'desc' }
        });
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// GET dashboard stats
const getStats = async (req, res) => {
    try {
        const [totalUsers, totalOrders, totalRestaurants, pendingRestaurants] = await Promise.all([
            prisma.users.count(),
            prisma.orders.count(),
            prisma.restaurants.count(),
            prisma.restaurants.count({ where: { is_approved: false } })
        ]);

        res.json({ totalUsers, totalOrders, totalRestaurants, pendingRestaurants });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getAllOrders, updateOrderStatus, getAllRestaurants, updateRestaurantStatus, getAllUsers, getStats };