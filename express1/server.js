const app = require('./app')
const port = process.env.port || 8000
const connectDB = require('./db/connect')
const db_connect = process.env.MONGO_URI

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