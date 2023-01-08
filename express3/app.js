require('dotenv').config() //importing environment variables
require('express-async-errors') //importing the express module for asynchronous errors

const express = require('express')
const app = express() // Initializing an instance for express 

const cookieParser = require('cookie-parser') //middleware that manages the cookies in our server

//Routers
const authRouter = require('./routes/auth')
const budgetRouter = require('./routes/budget')

//middleware function for auth, 500 and 404
const authMiddleware = require('./middleware/auth')
const notFoundMiddleware = require('./middleware/notfound')
const errorhandlermiddler = require('./middleware/errorhandler')

app.use(express.json()) //express middleware to pass request bodies in json format
app.use(cookieParser()) //express middleware that manages cookies
app.use(express.urlencoded({extended : true}))

app.use('/', authRouter) //authrouter

app.use('/', authMiddleware ,budgetRouter) //budgetrouter

//using the errorhanlers in our express instance
app.use(errorhandlermiddler) 
app.use(notFoundMiddleware)

module.exports = app