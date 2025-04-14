
const { sequelize } = require('../config/db');
const Product = require('../models/product');
const Image = require('../models/image');
const { Op } = require('sequelize');

// Admin-only: Create product with images
exports.createProduct = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { Name, Description, Price, isNew, isLimited, Discount, Category, Images } = req.body;

        // Validate required fields
        if (!Name || !Price || !Category) {
            await t.rollback();
            return res.status(400).json({ message: 'Name, Price and Category are required' });
        }

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
            productId: product.ID,
            product: await Product.findByPk(product.ID, {
                include: [{ model: Image, as: 'Images' }]
            })
        });
    } catch (error) {
        await t.rollback();
        console.error('Create Product Error:', error);
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
                attributes: ['ID', 'Image_URL']
            }],
            order: [['ID', 'ASC']]
        });
        res.json(products);
    } catch (error) {
        console.error('Get All Products Error:', error);
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
                attributes: ['ID', 'Image_URL']
            }]
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Get Product By ID Error:', error);
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
        const category = req.params.category.toLowerCase();

        if (!validCategories.includes(category)) {
            return res.status(400).json({ 
                message: 'Invalid category',
                validCategories
            });
        }

        const products = await Product.findAll({
            where: { Category: category },
            include: [{
                model: Image,
                as: 'Images',
                attributes: ['ID', 'Image_URL']
            }],
            order: [['ID', 'ASC']]
        });

        res.json(products);
    } catch (error) {
        console.error('Get Products By Category Error:', error);
        res.status(500).json({
            message: 'Error fetching products by category',
            error: error.message
        });
    }
};

// Admin-only: Update product
exports.updateProduct = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            await t.rollback();
            return res.status(404).json({ message: 'Product not found' });
        }

        const { Name, Description, Price, isNew, isLimited, Discount, Category, Images } = req.body;

        await product.update({
            Name: Name || product.Name,
            Description: Description !== undefined ? Description : product.Description,
            Price: Price || product.Price,
            isNew: isNew !== undefined ? isNew : product.isNew,
            isLimited: isLimited !== undefined ? isLimited : product.isLimited,
            Discount: Discount !== undefined ? Discount : product.Discount,
            Category: Category || product.Category
        }, { transaction: t });

        // Update images if provided
        if (Images) {
            await Image.destroy({ where: { P_id: product.ID }, transaction: t });
            if (Images.length > 0) {
                await Image.bulkCreate(
                    Images.map(url => ({
                        P_id: product.ID,
                        Image_URL: url
                    })),
                    { transaction: t }
                );
            }
        }

        await t.commit();
        res.json({
            message: 'Product updated successfully',
            product: await Product.findByPk(product.ID, {
                include: [{ model: Image, as: 'Images' }]
            })
        });
    } catch (error) {
        await t.rollback();
        console.error('Update Product Error:', error);
        res.status(500).json({
            message: 'Error updating product',
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
            await t.rollback();
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.destroy({ transaction: t });
        await t.commit();
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        await t.rollback();
        console.error('Delete Product Error:', error);
        res.status(500).json({
            message: 'Error deleting product',
            error: error.message
        });
    }
};