const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/register', register);
router.post('/login', login);

router.get('/profile', authMiddleware, (req, res) => {
    res.json({ message: 'Protected profile data', user: req.user });
});

router.get('/admin', authMiddleware, roleMiddleware('admin'), (req, res) => {
    res.json({ message: 'Welcome Admin' });
});

router.get('/customer', authMiddleware, roleMiddleware('customer'), (req, res) => {
    res.json({ message: 'Welcome Customer' });
});

module.exports = router;