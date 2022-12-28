const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    product_name : {
        type : String
    },

    owner : {
        type : String
    },

    price : {
        type : Number
    }
})

module.exports = mongoose.model('Product', productSchema)