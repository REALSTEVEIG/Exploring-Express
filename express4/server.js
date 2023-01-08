require('dotenv').config()

const app = require('./app')
const connectDB = require('./db/connect') 
const port = 5000

const start = async () => {
    try {
        await connectDB(process.env,MONGO_URI)
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}


start()