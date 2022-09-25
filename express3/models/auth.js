const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const mongoose = require('mongoose')

const authSchema = new mongoose.Schema({
    username : {
        type: String,
        required: [true, 'Please provide name'],
        maxlength: [50, 'Username is too long'],
        minlength: [3, 'Username is too short'],
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
        minlength: [3, 'Password is too short'],
      },
    }, {timestamps : true})
    

    authSchema.pre('save', async function () {
      const salt = await bcrypt.genSalt(10)
      this.password = await bcrypt.hash(this.password, salt)
    })


    authSchema.methods.getUsername = function () {
      return this.username
    }

    authSchema.methods.createJWT = function () {
      return jwt.sign({id : this._id, username : this.username}, process.env.JWT_SECRET, {expiresIn : process.env.JWT_LIFETIME})
    }

    authSchema.methods.comparePassword = async function (candidatePassword) {
      const isMatch = await bcrypt.compare(candidatePassword, this.password)
      return isMatch
    } 

    module.exports = mongoose.model('Auth', authSchema)