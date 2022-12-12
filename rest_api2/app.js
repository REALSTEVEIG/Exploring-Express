require('dotenv').config()
require('express-async-errors')

const express =require('express')
const app = express()
const port = process.env.PORT
const connectDB = require('./db/connect')
const authRouter = require('./routes/auth')
const budgetRouter = require('./routes/budget')

//SECURITY
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const limit = rateLimit({
    windowMs: 5 * 60 * 1000, // 15 minutes //ms means miliseconds and window represents the sessions
    max: 5, // Limit each IP to 100 requests per `window` (here, per 5 minutes)
    message : 'Too many requests sent using this IP address please try again later',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.set('trust proxy', 1)
app.use(cors())
app.use(helmet())
app.use(limit)
app.use(express.json())
app.use(express.urlencoded({extended : false}))

app.use('/api/v1', authRouter)
app.use('/api/v1', budgetRouter)

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()