const { Product, Image } = require('../models');
const sequelize = require('../config/db');
const { Op } = require('sequelize');

// Admin-only: Create product with images
exports.createProduct = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { Name, Description, Price, isNew, isLimited, Discount, Category, Images } = req.body;

        const product = await Product.create({
            Name,
            Description,
            Price,
            isNew,
            isLimited,
            Discount,
            Category
        }, { transaction: t });

        if (Images && Images.length > 0) {
            await Image.bulkCreate(
                Images.map(url => ({
                    P_id: product.ID,
                    Image_URL: url
                })),
                { transaction: t }
            );
        }

        await t.commit();
        res.status(201).json({
            message: 'Product created successfully',
            productId: product.ID
        });
    } catch (error) {
        await t.rollback();
        res.status(500).json({
            message: 'Error creating product',
            error: error.message
        });
    }
};

// Get all products with images
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{
                model: Image,
                as: 'Images',
                attributes: ['Image_URL']
            }]
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching products',
            error: error.message
        });
    }
};

// Get single product with images by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [{
                model: Image,
                as: 'Images',
                attributes: ['Image_URL']
            }]
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching product',
            error: error.message
        });
    }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
    try {
        const validCategories = ['bags', 'keychains', 'amigurumi', 'crochet bouquet', 'mug coasters'];
        if (!validCategories.includes(req.params.category)) {
            return res.status(400).json({ message: 'Invalid category' });
        }

        const products = await Product.findAll({
            where: { Category: req.params.category },
            include: [{
                model: Image,
                as: 'Images',
                attributes: ['Image_URL']
            }]
        });

        res.json(products);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching products by category',
            error: error.message
        });
    }
};

// Admin-only: Delete product
exports.deleteProduct = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.destroy({ transaction: t });
        await t.commit();
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        await t.rollback();
        res.status(500).json({
            message: 'Error deleting product',
            error: error.message
        });
    }
};