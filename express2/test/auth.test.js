require('dotenv').config()
const Auth = require('../models/auth')
const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../app')

jest.setTimeout(60000);

describe('API endpoints', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI)

        const connection = mongoose.connection

        if (!connection.readyState) {
            throw new Error('MonggoDB connection is not open!')
        }
    })

    afterAll(async () => {
        await Auth.deleteMany();
        await mongoose.connection.close();
        jest.clearAllMocks()
    })

    describe('Post /register', () => {
        it('Should register a new user', async () => {
            const res = await request(app)
                .post('/register')
                .send({
                    username : 'Steven',
                    email : 'steven@gmail.com',
                    password : 'steve123'
                })

                expect(res.status).toBe(201);
                expect(res.body).toHaveProperty('newUser');
                expect(res.body.newUser.username).toBe('Steven')
        })
    })

    describe('Post /login', () => {
        it('Should login an existing user', async () => {
            const res = await request(app)
                .post('/login')
                .send({
                    email : 'steven@gmail.com',
                    password : 'steve123'
                })

                expect(res.status).toBe(200)
                expect(res.body).toHaveProperty('user')
                expect(res.body.user.email).toBe('steven@gmail.com')
                expect(res.body).toHaveProperty('token')
        })
    })
}) 