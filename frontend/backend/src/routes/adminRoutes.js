const express = require('express');
const router = express.Router();

const {
    getAllOrders,
    updateOrderStatus,
    getAllRestaurants,
    updateRestaurantStatus,
    getAllUsers,
    getStats
} = require('../controllers/adminController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// All admin routes require login + admin role
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

router.get('/stats', getStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);
router.get('/restaurants', getAllRestaurants);
router.put('/restaurants/:id', updateRestaurantStatus);
router.get('/users', getAllUsers);

module.exports = router;