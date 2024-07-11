const ApiError = require('../utils/apiError')
const ApiResponse = require('../utils/apiResponse')
const asyncHandler = require('../utils/asyncHandler')
const Product = require('../models/productModel')
const sequelize = require('../config/db')
const { Op } = require('sequelize');


exports.createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, stock } = req.body;

    const product = await Product.create({
        name,
        description,
        price,
        stock
    });

    res.status(200).json({ error: "false", statuscode: "200", message: "Product Created Successfully", data: product });
});

exports.getAllProducts = asyncHandler(async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const searchQuery = req.query.search || '';

        const sortField = req.query.sortBy || 'id'
        const sortOrder = req.query.order === 'desc' ? 'DESC' : 'ASC';

        const products = await Product.findAll({
            where: {
                name: {
                    [ Op.like ]: `%${searchQuery}%`
                }
            },
            attributes: { exclude: [ 'password', 'refreshToken' ] }, 
            order: [ [ sortField, sortOrder ] ],
            offset: offset,
            limit: limit
        });

        if (!products.length) {
            throw new ApiError(404, 'No product found');
        }

        res.status(200).json(new ApiResponse(200, products, 'Products fetched successfully'));

    } catch (error) {
        console.error(error);
        return res.status(500).json(new ApiError(500, [], "Something went wrong while fetching products"));
    }
});

exports.updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { name, description, price, stock } = req.body;

    try {
        const product = await Product.findByPk(id);
        if (product) {
            product.name = name;
            product.description = description;
            product.price = price;
            product.stock = stock;

            await product.save();
            const updatedProduct = await Product.findByPk(product.id);

            return res.status(200).json(new ApiResponse(200 , updatedProduct, 'Product updated successfully'));

        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

exports.deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deleteProduct = await Product.findByPk(id);
        if (deleteProduct) {
            await deleteProduct.destroy();
            return res.status(200).json(new ApiResponse(200, 'Product deleted successfully'));
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

exports.getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id);
        
        if (!product) {    
           
            res.status(404).json({ error: 'Product not found' });
            
        } else {
            return res.status(200).json(new ApiResponse(200, product, 'Product retrieved successfully'));
        }
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});
