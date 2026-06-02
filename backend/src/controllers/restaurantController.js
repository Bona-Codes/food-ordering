const prisma = require('../config/db');

const createRestaurant = async (req, res) => {

    try {

        const {
            name,
            description,
            email,
            phone
        } = req.body;

        // create restaurant owner
        let owner = await prisma.restaurant_owners.findUnique({
            where: {
                user_id: req.user.userId
            }
        });

        if (!owner) {

            owner = await prisma.restaurant_owners.create({
                data: {
                    user_id: req.user.userId,
                    business_name: name
                }
            });

        }

        // create restaurant
        const restaurant = await prisma.restaurants.create({
            data: {
                owner_id: owner.owner_id,
                name,
                description,
                email,
                phone
            }
        });

        res.status(201).json({
            message: 'Restaurant created',
            restaurant
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server Error'
        });

    }

};

const getRestaurants = async (req, res) => {

    try {

        const restaurants = await prisma.restaurants.findMany();

        res.status(200).json(restaurants);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server Error'
        });

    }

};

const getRestaurantById = async (req, res) => {

    try {

        const { id } = req.params;

        const restaurant = await prisma.restaurants.findUnique({
            where: {
                restaurant_id: parseInt(id)
            }
        });

        if (!restaurant) {

            return res.status(404).json({
                message: 'Restaurant not found'
            });

        }

        res.status(200).json(restaurant);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server Error'
        });

    }

};
const updateRestaurant = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            name,
            description,
            email,
            phone
        } = req.body;

        // check restaurant
        const existingRestaurant = await prisma.restaurants.findUnique({
            where: {
                restaurant_id: parseInt(id)
            }
        });

        if (!existingRestaurant) {

            return res.status(404).json({
                message: 'Restaurant not found'
            });

        }

        // update restaurant
        const updatedRestaurant = await prisma.restaurants.update({
            where: {
                restaurant_id: parseInt(id)
            },
            data: {
                name,
                description,
                email,
                phone
            }
        });

        res.status(200).json({
            message: 'Restaurant updated',
            restaurant: updatedRestaurant
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server Error'
        });

    }

};
const deleteRestaurant = async (req, res) => {

    try {

        const { id } = req.params;

        // check restaurant
        const existingRestaurant = await prisma.restaurants.findUnique({
            where: {
                restaurant_id: parseInt(id)
            }
        });

        if (!existingRestaurant) {

            return res.status(404).json({
                message: 'Restaurant not found'
            });

        }

        // delete restaurant
        await prisma.restaurants.delete({
            where: {
                restaurant_id: parseInt(id)
            }
        });

        res.status(200).json({
            message: 'Restaurant deleted successfully'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server Error'
        });

    }

};

module.exports = {
    createRestaurant,
    getRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant
};
