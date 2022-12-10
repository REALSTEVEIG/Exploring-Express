const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const authSchema = mongoose.Schema({
    username : {
        type : String
    },
    
    email : {
        type : String
    },

    password : {
        type : String
    },

    confirm_password : {
        type : String
    }

},
{
    timestamps : true,
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
})

authSchema.virtual("budgets", {
    ref: "Budgets",
    foreignField: "owner",
    localField: "username",
  });

authSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    this.confirm_password = undefined
})

authSchema.methods.createJWT = function () {
    return jwt.sign({
        id : this._id,
        username : this.username
    }, process.env.JWT_SECRET, {expiresIn : process.env.JWT_LIFETIME})
}

authSchema.methods.comparePasswords = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch;
}

module.exports = mongoose.model('User', authSchema)