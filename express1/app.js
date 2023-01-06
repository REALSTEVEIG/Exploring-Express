require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const authRouter = require('./routes/auth')
const productsRouter = require('./routes/products')
const notFoundMiddleware = require('./middleware/notfound')
const errorHanlerMiddleware = require('./middleware/errorhandler')
const authMiddleware = require('./middleware/auth')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cookieParser())

app.use('/', authRouter)
app.use('/', authMiddleware, productsRouter)

app.use(notFoundMiddleware)
app.use(errorHanlerMiddleware)

module.exports = app