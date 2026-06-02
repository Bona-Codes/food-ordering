const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');

const restaurantRoutes = require('./routes/restaurantRoutes');
const menuRoutes = require('./routes/menuRoutes');

const cartRoutes = require('./routes/cartRoutes');

const orderRoutes = require('./routes/orderRoutes');

const adminRoutes = require('./routes/adminRoutes');



const app = express();

app.use(cors());
app.use(express.json())
app.use('/api/restaurants',
    restaurantRoutes);

app.use('/api/menu', menuRoutes);

app.get('/', (req, res) => {
    res.send('Food Ordering API Running');
});

app.use('/api/auth', authRoutes);

app.use('/api/cart', cartRoutes);

app.use('/api/orders', orderRoutes);

app.use('/api/admin', adminRoutes);
module.exports = app;