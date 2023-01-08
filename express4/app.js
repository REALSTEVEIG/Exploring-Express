require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const connect = require('./db/connect')
const authRouter = require('./routes/auth')
const budgetRouter = require('./routes/budget')
const cookieParser = require('cookie-parser')
const notFoundMiddleware = require('./middlewares/notfound')
const errorHandlerMiddleware = require('./middlewares/errorhandler')
const authHandlerMiddleware = require('../express4/middlewares/auth')

app.use(express.json())
app.use(cookieParser())

app.use('/', authRouter)
app.use('/', authHandlerMiddleware ,budgetRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

module.exports = app