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
// const userValidate = require('./middlewares/userValidate')

app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use(cookieParser())

app.use('/', authRouter)
app.use('/', authMiddleware, budgetRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

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

start(mongo_url)