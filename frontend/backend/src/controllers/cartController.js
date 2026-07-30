const prisma = require('../config/db');

const addToCart = async (req, res) => {

    try {

        const {
            restaurant_id,
            menu_item_id,
            quantity
        } = req.body;

        // find customer using logged-in user
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

        const customer_id = customer.customer_id;

        // find active cart
        let cart = await prisma.carts.findFirst({
            where: {
                customer_id,
                restaurant_id,
                is_active: true
            }
        });

        // create cart if not exists
        if (!cart) {

            cart = await prisma.carts.create({
                data: {
                    customer_id,
                    restaurant_id
                }
            });

        }

        // get menu item
        const menuItem = await prisma.menu_items.findUnique({
            where: {
                menu_item_id
            }
        });

        if (!menuItem) {

            return res.status(404).json({
                message: 'Menu item not found'
            });

        }

        // add cart item
        const cartItem = await prisma.cart_items.create({
            data: {
                cart_id: cart.cart_id,
                menu_item_id,
                quantity,
                unit_price: menuItem.price
            }
        });

        res.status(201).json({
            message: 'Item added to cart',
            cartItem
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server Error'
        });

    }

};
const getCart = async (req, res) => {

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

        const customer_id = customer.customer_id;

        const cart = await prisma.carts.findFirst({
            where: {
                customer_id,
                is_active: true
            },
            include: {
                cart_items: {
                    include: {
                        menu_items: true
                    }
                }
            }
        });

        if (!cart) {

            return res.status(404).json({
                message: 'Cart is empty'
            });

        }

        res.status(200).json(cart);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server Error'
        });

    }

};
const updateCartItem = async (req, res) => {

    try {

        const { id } = req.params;

        const { quantity } = req.body;

        const cartItem = await prisma.cart_items.update({
            where: {
                cart_item_id: parseInt(id)
            },
            data: {
                quantity
            }
        });

        res.status(200).json({
            message: 'Cart item updated',
            cartItem
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server Error'
        });

    }

};
const deleteCartItem = async (req, res) => {

    try {

        const { id } = req.params;

        await prisma.cart_items.delete({
            where: {
                cart_item_id: parseInt(id)
            }
        });

        res.status(200).json({
            message: 'Cart item deleted'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server Error'
        });

    }

};
module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    deleteCartItem
};