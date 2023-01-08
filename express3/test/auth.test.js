require('dotenv').config()

const mongoose = require('mongoose')
const app = require('../app')
const Auth = require('../models/auth')
const request = require('supertest')

jest.setTimeout(30000)

describe('API endpoints', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI, {useUnifiedTopology: true, useNewUrlParser: true})

        const connection = mongoose.connection

        if (!connection.readyState) {
            throw new Error('MongoDB is not connected!')
        }
    })

    afterAll(async () => {
        await Auth.deleteMany()
        await mongoose.connection.close()
        jest.clearAllMocks()
    })

    describe('POST /register', () => {
        it(`Should register a new user`, async () => {
            const res = await request(app)
                .post('/register')
                .send({
                    username : "steve1",
                    email : 'steve1@gmail.com',
                    password : 'steve1'
                })
                // console.log(res.body)
                expect(res.status).toBe(201)
                expect(res.body).toHaveProperty('createdUser')
        })
    })

    describe(`POST /login`, () => {
        it('Should login a user', async () => {
            const res = await request(app)
                .post('/login')
                .send({
                    email : "steve1@gmail.com",
                    password : "steve1"
                })
                // console.log(res.body)
                expect(res.status).toBe(200)
                expect(res.body.user.email).toBe("steve1@gmail.com")
        })
    })
})