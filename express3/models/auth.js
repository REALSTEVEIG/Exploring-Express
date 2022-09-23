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
    