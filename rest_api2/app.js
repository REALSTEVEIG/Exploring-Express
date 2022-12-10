require('dotenv').config()
require('express-async-errors')

const express =require('express')
const app = express()
const port = process.env.PORT
const connectDB = require('./db/connect')
const authRouter = require('./routes/auth')
const budgetRouter = require('./routes/budget')

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