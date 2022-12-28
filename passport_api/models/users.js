const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
    username : {
        type : String
    },

    email : {
        type : String
    }
})

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
  });

module.exports = mongoose.model('User', userSchema)
