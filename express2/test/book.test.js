require('dotenv').config()

const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const Book = require('../models/books')
let token
let id

jest.setTimeout(1200000)

describe('API endpoints', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI)

        const connection = mongoose.connection

        if (!connection.readyState) {
            throw new Error('MongoDB is not connected!')
        }

        const registerUser = await supertest(app)
            .post("/register")
            .set("Content-Type", "application/json")
            .send({ 
                username : 'Steve',
                email: "steve@gmail.com", 
                password: "steve" 
            });

        // console.log(registerUser.body)
        token = registerUser.body.token
    })

    afterAll(async () => {
        await Book.deleteMany()
        await mongoose.connection.close()
        jest.clearAllMocks()
    })

    describe('Post /book', () => {
        it('Should create a new book', async () => {
            const response = await supertest(app)
                .post('/book')
                .set("Cookie", `token=${token}`)
                .send({
                    title : 'Things Fall Apart',
                    author : 'Chinua Achebe',
                    price : '$5000'
                })

                id = response.body.newBook._id

                expect(response.status).toBe(201)
                // console.log(response.body)
                expect(response.body).toHaveProperty('msg')
                expect(response.body.newBook.title).toBe('Things Fall Apart')
        })
    })

    describe('Get /book', () => {
        it('Should get all books', async () => {
            const response = await supertest(app)
                .get('/book')
                .set("Cookie", `token=${token}`)
                // console.log(response.body)
                expect(response.status).toBe(200)
                expect(response.body.allBooks.length).toBeGreaterThan(0)
        })
    })

    describe('Get /book/:id', () => {
        it('Should get a single book', async () => {
            const response = await supertest(app)
                .get(`/book/${id}`)
                .set("Cookie", `token=${token}`)
                expect(response.status).toBe(200)
                expect(response.body.singleBook.title).toBe('Things Fall Apart')
        })
    })

    describe('Update /book/:id', () => {
        it('Should update a book', async () => {
            const response = await supertest(app)
                .patch(`/book/${id}`)
                .set("Cookie", `token=${token}`)
                .send({
                    price : '$7000'
            })
                // console.log(response.body)
                expect(response.status).toBe(201)
                expect(response.body.updateBook.price).toBe('$7000')
        })
    })

    describe('Delete /book/:id', () => {
        it('Should delete a book', async () => {
            const response = await supertest(app)
                .delete(`/book/${id}`)
                .set("Cookie", `token=${token}`)
                expect(response.status).toBe(200)
                expect(response.body.msg).toBe('Book has been deleted successfully!')
        })
    })
})