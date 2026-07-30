const prisma = require('../config/db');

const createOrder = async (req, res) => {

    try {

        // find customer
        const customer = await prisma.customers.findUnique({
            where: {
                user_id: req.user.userId
            }
        });

        if (!customer) {

            return res.status(404).json({
                message: 'Customer not found'
            });

        }

        // get active cart
        const cart = await prisma.carts.findFirst({
            where: {
                customer_id: customer.customer_id,
                is_active: true
            },
            include: {
                cart_items: true
            }
        });

        if (!cart || cart.cart_items.length === 0) {

            return res.status(400).json({
                message: 'Cart is empty'
            });

        }

        // calculate total
        let subtotal = 0;

        cart.cart_items.forEach(item => {
            subtotal += Number(item.unit_price) * item.quantity;
        });

        // create order
        const order = await prisma.orders.create({
            data: {
                customer_id: customer.customer_id,
                restaurant_id: cart.restaurant_id,
                subtotal,
                total_amount: subtotal
            }
        });

        // create order items
        for (const item of cart.cart_items) {

            await prisma.order_items.create({
                data: {
                    order_id: order.order_id,
                    menu_item_id: item.menu_item_id,
                    quantity: item.quantity,
                    price: item.unit_price
                }
            });

        }

        // deactivate cart
        await prisma.carts.update({
            where: {
                cart_id: cart.cart_id
            },
            data: {
                is_active: false
            }
        });

        res.status(201).json({
            message: 'Order created successfully',
            order
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server Error'
        });

    }

};
const getOrders = async (req, res) => {

    try {

        // find customer
        const customer = await prisma.customers.findUnique({
            where: {
                user_id: req.user.userId
            }
        });

        if (!customer) {

            return res.status(404).json({
                message: 'Customer not found'
            });

        }

        const orders = await prisma.orders.findMany({
            where: {
                customer_id: customer.customer_id
            },
            include: {
                order_items: {
                    include: {
                        menu_items: true
                    }
                }
            },
            orderBy: {
                order_date: 'desc'
            }
        });

        res.status(200).json(orders);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server Error'
        });

    }

};
const updateOrderStatus = async (req, res) => {

    try {

        const { id } = req.params;

        const { order_status } = req.body;

        const order = await prisma.orders.update({
            where: {
                order_id: parseInt(id)
            },
            data: {
                order_status
            }
        });

        res.status(200).json({
            message: 'Order status updated',
            order
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server Error'
        });

    }

};

module.exports = {
    createOrder,
    getOrders,
    updateOrderStatus
};