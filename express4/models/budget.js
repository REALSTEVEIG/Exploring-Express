const mongoose = require('mongoose')

const budgetSchema = mongoose.Schema({
    budgetName : {
        type : String,
        required : [true, `Please provide a budget name`]
    },

    budgetCost : {
        type : Number,
        required : [true, 'Please specify the amount intended for use']
    },

    createdBy : {
        type : String
    },

    updatedBy : {
        type : String
    },

    deletedBy : {
        type : String
    }
})

budgetSchema.index({budgetName : 'text'})

module.exports = mongoose.model('Budget', budgetSchema)