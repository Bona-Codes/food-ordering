const express = require('express');

const router = express.Router();

const {
    addToCart,
    getCart,
    updateCartItem,
    deleteCartItem
} = require('../controllers/cartController');

const authMiddleware = require('../middleware/authMiddleware');

router.post(
    '/',
    authMiddleware,
    addToCart
);

router.get(
    '/',
    authMiddleware,
    getCart
);
router.put(
    '/:id',
    authMiddleware,
    updateCartItem
);
router.delete(
    '/:id',
    authMiddleware,
    deleteCartItem
);

module.exports = router;