const mongoose  = require('mongoose')

const bookSchema = mongoose.Schema({

    title : {
        type : String
    }, 
    author : {
        type : String
    },
    price : {
        type : String
    },

    createdBy : {
        type : String
    },

    requestedBy : {
        type : String
    },

    updatedBy : {

    },

    deletedBy : {
        type : String
    }

}, {timestamps : true} )

module.exports = mongoose.model('Books', bookSchema)