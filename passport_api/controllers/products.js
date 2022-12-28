const Product = require('../models/products')

exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create({...req.body, owner : req.user.username})
        return res
            .status(201)
            .json({Message : `New product added successfuly by ${req.user.username}`, product})
    } catch (error) {
       console.log(error)
       return res
            .status(500)
            .json({error : error.Message}) 
    }
}

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({})
        return res
            .status(200)
            .json({products})
    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .json({error : error.message})
    }
}

exports.getSingleProduct = async (req, res) => {
    try {
        const {id : productId} = req.params
        const product = await Product.findOne({_id : productId})
        if (!product) {
            return res
                .status(404)
                .json({error : `No product with id ${productId}`})
        }

        return res
            .status(200)
            .json({product})
    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .json({error : error.message})
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const {id : productId} = req.params
        
        const updateProduct = await Product.findByIdAndUpdate(
            {_id : productId}, req.body, {new : true, runValidators : true})

        if (!updateProduct) {
            return res
                .status(404)
                .json({error : `No product with ID ${productId} was found in our database`})
        }

        return res
            .status(201)
            .json({updateProduct})
    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .json({error : error.Message})
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const {id : productId} = req.params

        const deleteProduct = await Product.findByIdAndDelete({_id : productId})

        if (!deleteProduct) {
            return res
                .status(400)
                .json({error : `Product with id ${productId} was not found!`})
        }

        return res
            .status(200)
            .json({success : `Successfully delected the product`})
    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .json({error : error.message})
    }
}