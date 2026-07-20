const express = require('express');
const router = express.Router();

const {
    getMyRestaurant,
    getMyOrders,
    updateOrderStatus,
    getMyMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
} = require('../controllers/restaurantOwnerController');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware('restaurant_owner'));

router.get('/restaurant', getMyRestaurant);
router.get('/orders', getMyOrders);
router.put('/orders/:id', updateOrderStatus);
router.get('/menu', getMyMenu);
router.post('/menu', addMenuItem);
router.put('/menu/:id', updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);

module.exports = router;