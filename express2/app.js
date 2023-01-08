require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const authRouter = require('./routes/auth')
const booksRouter = require('./routes/books')
const cookieParser = require('cookie-parser')
const notFoundMiddleware = require('./middlewares/notfound')
const errorHanlerMiddleware = require('./middlewares/errorhandler')
const authenticationMiddleware = require('./middlewares/auth')

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cookieParser())

app.use('/', authRouter)
app.use('/', authenticationMiddleware, booksRouter)

app.use(notFoundMiddleware)
app.use(errorHanlerMiddleware)

module.exports = app