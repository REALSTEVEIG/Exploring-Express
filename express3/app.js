require('dotenv').config() //importing environment variables
require('express-async-errors') //importing the express module for asynchronous errors

const express = require('express')
const app = express() // Initializing an instance for express 

const port = process.env.PORT || 7700 //localhost to run server

const mongouri = process.env.MONGO_URI //connection string for my database

const cookieParser = require('cookie-parser') //middleware that manages the cookies in our server

const connectDB = require('./db/connect') //function to connect to mongodb

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

// app.get('/', (req, res) => {
//     res.redirect('http://www.google.com/?q=book+published+in+year+2022')
// })


// app.get('/facebook', (req, res) => {
//     res.redirect('https://web.facebook.com/stephen.ignatius.92/')
// })

//using the errorhanlers in our express instance
app.use(errorhandlermiddler) 
app.use(notFoundMiddleware)


//function to start our application on localhost
const start = async (url) => {
    try {
        await connectDB(url)
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

//passing our mongouri from .env as a parameter in the start application
start(mongouri)