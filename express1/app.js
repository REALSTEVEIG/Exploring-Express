require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const port = process.env.port || 8000
const connectDB = require('./db/connect')
const db_connect = process.env.MONGO_URI
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

start(db_connect)

