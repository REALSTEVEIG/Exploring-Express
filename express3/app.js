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

// app.get('/', (req, res) => {
//     res.redirect('http://www.google.com/?q=book+published+in+year+2022')
// })


// app.get('/facebook', (req, res) => {
//     res.redirect('https://web.facebook.com/stephen.ignatius.92/')
// })

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