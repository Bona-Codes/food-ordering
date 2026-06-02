const prisma = require('../config/db');

const createMenuItem = async (req, res) => {

    try {

        const {
            restaurant_id,
            category_id,
            name,
            description,
            price,
            preparation_time
        } = req.body;

        const menuItem = await prisma.menu_items.create({
            data: {
                restaurant_id,
                category_id,
                name,
                description,
                price,
                preparation_time
            }
        });

        res.status(201).json({
            message: 'Menu item created',
            menuItem
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server Error'
        });

    }

};

const getMenuItems = async (req, res) => {

    try {

        const { restaurant_id } = req.query;

        const where = restaurant_id ? { restaurant_id: parseInt(restaurant_id) } : {};

        const menuItems = await prisma.menu_items.findMany({ where });

        res.status(200).json(menuItems);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server Error'
        });

    }

};

const updateMenuItem = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            name,
            description,
            price,
            preparation_time,
            availability_status
        } = req.body;

        // check menu item
        const existingMenuItem = await prisma.menu_items.findUnique({
            where: {
                menu_item_id: parseInt(id)
            }
        });

        if (!existingMenuItem) {

            return res.status(404).json({
                message: 'Menu item not found'
            });

        }

        // update menu item
        const updatedMenuItem = await prisma.menu_items.update({
            where: {
                menu_item_id: parseInt(id)
            },
            data: {
                name,
                description,
                price,
                preparation_time,
                availability_status
            }
        });

        res.status(200).json({
            message: 'Menu item updated',
            menuItem: updatedMenuItem
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server Error'
        });

    }

};
const deleteMenuItem = async (req, res) => {

    try {

        const { id } = req.params;

        // check menu item
        const existingMenuItem = await prisma.menu_items.findUnique({
            where: {
                menu_item_id: parseInt(id)
            }
        });

        if (!existingMenuItem) {

            return res.status(404).json({
                message: 'Menu item not found'
            });

        }

        // delete menu item
        await prisma.menu_items.delete({
            where: {
                menu_item_id: parseInt(id)
            }
        });

        res.status(200).json({
            message: 'Menu item deleted successfully'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server Error'
        });

    }

};

module.exports = {
    createMenuItem,
    getMenuItems,
    updateMenuItem,
    deleteMenuItem
};
