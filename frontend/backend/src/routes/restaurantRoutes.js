const express = require('express');

const router = express.Router();



const {
    createRestaurant,
    getRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant
} = require('../controllers/restaurantController');

const authMiddleware = require('../middleware/authMiddleware');

const roleMiddleware = require('../middleware/roleMiddleware');

router.post(
    '/',
    authMiddleware,
    roleMiddleware('admin'),
    createRestaurant
);
router.put(
    '/:id',
    authMiddleware,
    roleMiddleware('admin'),
    updateRestaurant
);
router.delete(
    '/:id',
    authMiddleware,
    roleMiddleware('admin'),
    deleteRestaurant
);

router.get('/', getRestaurants);

router.get('/:id', getRestaurantById);

module.exports = router;