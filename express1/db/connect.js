const mongoose = require('mongoose')

const connectDB = function (url) {
    return mongoose.connect(url, {useNewUrlParser : true, useUnifiedTopology : true})
}

module.exports = connectDB