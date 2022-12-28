require('dotenv').config()

const express = require('express')
const app = express()
const port = 3000
const connectDB = require('./db/connect')
const userRouter = require('./routes/user')

//User Schema
const User = require('./models/users')

//session management
const session = require('express-session')
const MongoStore = require('connect-mongo');

//passport
const passport = require('passport')
const LocalStrategy = require('passport-local')

app.use(session({
    secret: "my-session-secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 5 * 60 * 1000 
    },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
}))

//passport initialize
app.use(passport.initialize())
app.use(passport.session())

// Configure Passport to use the local strategy for authentication
passport.use(User.createStrategy())
// Tell Passport how to serialize and deserialize user accounts
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use('/', userRouter)

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => console.log(`Server is listening on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}

start()