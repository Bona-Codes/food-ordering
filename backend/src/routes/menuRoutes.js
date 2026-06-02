const express = require('express');

const router = express.Router();

const {
    createMenuItem,
    getMenuItems,
    updateMenuItem,
    deleteMenuItem
} = require('../controllers/menuController');

const authMiddleware = require('../middleware/authMiddleware');

const roleMiddleware = require('../middleware/roleMiddleware');

router.post(
    '/',
    authMiddleware,
    roleMiddleware('admin'),
    createMenuItem
);

router.get('/', getMenuItems);

router.put(
    '/:id',
    authMiddleware,
    roleMiddleware('admin'),
    updateMenuItem

);

router.delete(
    '/:id',
    authMiddleware,
    roleMiddleware('admin'),
    deleteMenuItem
);

module.exports = router;