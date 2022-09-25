const mongoose = require('mongoose')

const budgetSchema = mongoose.Schema({
    budgetName : {
        type : String,
        required : true
    },

    budgetExpense : {
        type : String,
        required : true
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

module.exports = mongoose.model('Budget', budgetSchema)

// const voteSchema = mongoose.Schema({
//     voterName : {
//         type : String,
//         required : true
//     },

//     votedFor : {
//         type : String,
//     }
// })

// module.exports = voterSchema.model('Vote', voteSchema)