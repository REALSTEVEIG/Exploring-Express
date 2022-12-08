require('dotenv').config()
require('express-async-error')

const express = require('express')
const app = express()
const authRouter = require('./routes/auth')
const budgetRouter = require('./routes/budget')
const connectDB = require('./db/connect')
const port = process.env.port || 7700
const cookieParser = require('cookie-parser')
const mongo_url = process.env.MONGO_URI
const authMiddleware = require('./middlewares/auth')
const notFoundMiddleware = require('./middlewares/notfound')
const errorHandlerMiddleware = require('./middlewares/errorhandler')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')

//LOGGING
const logger = require('./logger/logger')

app.use(morgan('dev'))

const limit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes //ms means miliseconds and window represents the sessions
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message : 'Too many requests sent using this IP address please try again later',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limit)


app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use(cookieParser())

app.set('trust proxy', 1)

app.get('/', (req, res) => {
    logger.info('This is a logger info')
    res.send('Hello from the hompage')
})

app.get('/error', (req, res) => {
    throw new Error('An error has occured on this page')
})

app.use((err, req, res, next) => {
    logger.error(err.meessage)
    res.status(500).send('Something went wrong with our server!')
})
 
app.use('/', authRouter)
app.use('/', authMiddleware, budgetRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const start = async (url) => {
    try {
        await connectDB(url)
        app.listen(port, () => {
            logger.info(`Server is listening on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start(mongo_url)