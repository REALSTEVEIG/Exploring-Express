const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const authShema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide name'],
        maxlength: 50,
        minlength: 3,
      },
      email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          'Please provide a valid email',
        ],
        unique: true,
      },
      password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
      },
},{timestamps : true})

authShema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

authShema.methods.getUsername = function () {
    return this.username
}

authShema.methods.createJWT = function () {
    return jwt.sign(
         {id : this._id, username : this.username},
         process.env.JWT_SECRET, 
         {expiresIn : process.env.JWT_LIFETIME})
}

authShema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}


module.exports = mongoose.model('Auth', authShema)
