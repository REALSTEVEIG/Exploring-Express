require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const port = process.env.PORT || 3300
const mongouri = process.env.MONGO_URI
const connectDB = require('./db/connect')
const cookieParser = require('cookie-parser')
const notFoundMiddleware = require('./middleware/notfound')
const errorhandlermiddler = require('./middleware/errorhandler')

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended : true}))

// app.use('/', )

// app.use('/checker') = (req, res) => {
//     res.redirect('http://www.google.com')
// }

app.use(errorhandlermiddler)
app.use(notFoundMiddleware)


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

start(mongouri)