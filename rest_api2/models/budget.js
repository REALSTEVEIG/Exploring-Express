const mongoose = require('mongoose')
const {Schema} =  mongoose;

const budgetSchema = new mongoose.Schema({
    budget_name : {
        type : String,
        required : true
    },

    budget_price : {
        type : Number
    },

    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required: [true, "Budget must have an owner"],
    }
},
{
    timestamps : true,
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
}
)

// budgetSchema.pre(/^find/, function (next) {
//     this.populate({
//       path: "owner",
//       select: {"budget_name" : 1, "budget_price" : 1}
//     });
//     next();
//   });

module.exports = mongoose.model('Budget', budgetSchema)