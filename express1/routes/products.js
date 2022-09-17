const express = require('express')
const router = express.Router()

const {createProduct, getSingleProduct, getAllProducts, updateProduct, deleteProduct} = require('../controllers/products')

router.route('/product').post(createProduct).get(getAllProducts)
router.route('/product/:id').get(getSingleProduct).patch(updateProduct).delete(deleteProduct)

module.exports = router