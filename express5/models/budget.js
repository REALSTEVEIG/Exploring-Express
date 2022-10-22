const mongoose = require('mongoose')

const budgetSchema = new mongoose.Schema({
    budgetName : {
        type : String
    },

    budgetPrice : {
        type : String
    },

    createdBy : {
        type : String
    },

    updatedBy : {
        type : String
    },

    deletedBy : {
        type : String
    },

    requestedBy : {
        type : String
    }
}, {timestamps : true})


module.exports = mongoose.model('Budget', budgetSchema)