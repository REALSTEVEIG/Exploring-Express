const mongoose = require('mongoose')

const budgetSchema = mongoose.Schema({
    budgetName : {
        type : String,
        required : [true, `Please provide a budget name`]
    },

    budgetCost : {
        type : String,
        required : [true, 'Please specify the amount intended for use']
    },

    createdBy : {
        type : String
    },

    updatedBy : {
        tyoe : String
    },

    deletedBy : {
        type : String
    }
})

module.exports = mongoose.model('Budget', budgetSchema)