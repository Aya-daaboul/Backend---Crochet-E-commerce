const { sequelize } = require('../config/db');
const Review = require('../models/review');
const User = require('../models/user');

exports.createReview = async (req, res) => {
    try {
        const { P_id, Description, Rating } = req.body;
        const U_id = req.user.userId;

        if (Rating < 1 || Rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const review = await Review.create({
            P_id,
            Description,
            Rating,
            U_id
        });

        res.status(201).json({
            message: 'Review added successfully',
            review
        });
    } catch (error) {
        console.error('Create Review Error:', error);
        res.status(500).json({
            message: 'Error creating review',
            error: error.message
        });
    }
};

exports.getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { P_id: req.params.productId },
            include: [{
                model: User,
                attributes: ['Name']
            }]
        });
        res.json(reviews);
    } catch (error) {
        console.error('Get Reviews Error:', error);
        res.status(500).json({
            message: 'Error fetching reviews',
            error: error.message
        });
    }
};