const mongoose = require('mongoose')

const connectDB = (url) => {return new mongoose.connect(url), {useNewUrlParser : true, useModifiedTopology : true}}

module.exports = connectDB