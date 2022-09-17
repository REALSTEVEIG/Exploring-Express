const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    product_name : {
        type : String,
        required : true
    },

    price : {
        type : String,
        require : true
    },

    createdBy : {
        type : String
    }
},
{ timestamps: true }
)

module.exports = mongoose.model('Product', productSchema)