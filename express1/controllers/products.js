const { BadRequestAPIError, NotFoundAPIError } = require('../errors')
const Product = require('../models/products')
const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')

exports.createProduct = async (req, res) => {

    try {
        const {product_name, price} = req.body
    
        if (!product_name || !price) {
            throw new BadRequestAPIError(`Please provide all the required parametres!`)
        }

        const token = req.cookies.token

        const payload = jwt.verify(token, process.env.JWT_SECRET)

        const createdBy = payload.username

        const newProduct = await Product.create({...req.body, createdBy})

        console.log(req.cookies)
        
        return res.status(StatusCodes.CREATED).json({newProduct})

    } catch (error) {
        console.log(error.message)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg :error.message})
    }
}

exports.getSingleProduct = async (req, res) => {
    try {
        
    const {id : productId} = req.params

    const singleProduct = await Product.findOne({_id : productId})
 
    if (!singleProduct) {
        throw new BadRequestAPIError(`No product with id ${id}`) 
    }

    return res.status(StatusCodes.OK).json({msg : singleProduct})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
    }
}


exports.getAllProducts = async (req, res) => {
    try {
        const allProducts = await Product.find()
        return res.status(StatusCodes.OK).json({allProducts, count : allProducts.length})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg : error.message})
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const {params : {id : productId}, body : {product_name, price}} = req

        if (!product_name || !price) {
            throw new BadRequestAPIError('Please provide all the required parameters!')
        }
    
        const updateProduct = await Product.findByIdAndUpdate({_id : productId}, req.body, {new : true, runValidators : true})
    
        if (!updateProduct) {
            throw new NotFoundAPIError(`Product with id ${id} not found, please provide another product!`)
        }
    
        return res.status(StatusCodes.OK).json({updateProduct})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg : error.message})
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const {id : productId} = req.params
    
        const deleteProduct = await Product.findByIdAndDelete({_id: productId})
    
        if (!deleteProduct) {
            throw new NotFoundAPIError(`No product with id ${id}`)
        }
    
        return res.status(StatusCodes.OK).json({msg : `Deleted Successfully`})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
    }
}