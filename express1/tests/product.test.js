const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../app')
const Product = require('../models/products')

let token;
let productId;

require('dotenv').config()

jest.setTimeout(30000)

describe('API endpoints', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser : true, useUnifiedTopology : true})

        const connection = mongoose.connection

        if (!connection.readyState) {
            throw new Error('MongoDB connection is not open')
        }

        const registerUser = await request(app)
            .post("/register")
            .set("Content-Type", "application/json")
            .send({ 
                username : 'Steve',
                email: "steve@gmail.com", 
                password: "steve" 
            });
        token = registerUser.body.token
        // console.log(token)
    })

    afterAll(async () => {
        await Product.deleteMany()
        await mongoose.connection.close()
    })

    describe('Post /product', () => {
        it('Should create a new product', async () => {
            const res = await request(app)
            .post('/product')
            .set("Content-Type", "application/json")
            .set("Cookie", `token=${token}`)  // Set the cookie value here
            .send({
                product_name : 'Shoe',
                price : '3000'
            })
            // console.log(res.body)
            productId = res.body.newProduct._id
            // console.log(productId)
            expect(res.status).toBe(201)
            expect(res.body).toHaveProperty('newProduct')
        })
    })

    describe('Get /product', () => {
        it('Should get all the products in our database', async () => {
            const res = await request(app)
            .get('/product')
            .set("Cookie", `token=${token}`)  // Set the cookie value here
            // console.log(res.body)
            expect(res.status).toBe(200)
            expect(res.body.allProducts.length).toBeGreaterThan(0);
        })
    })

    describe('Get /product/:id', () => {
        it('Should get a single product from our database', async () => {
            const res = await request(app)
            .get(`/product/${productId}`)
            .set("Cookie", `token=${token}`) // Set the cookie value here
            // console.log(res.body)
            expect(res.status).toBe(200)
            expect(res.body.msg.product_name).toBe('Shoe')
        })
    })

    describe('Update /product/:id', () => {
        it('Should update a single product by its id', async () => {
            const res = await request(app)
            .patch(`/product/${productId}`)
            .set("Cookie", `token=${token}`)
            .send({
                product_name : 'Samsung',
                price : '250,000'
            })
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('updateProduct')
            expect(res.body.updateProduct.product_name).toBe('Samsung') 
        })
    })

    describe('Delete /product/:id', () => {
        it('Should delete a single product by its id', async () => {
            const res = await request(app)
            .delete(`/product/${productId}`)
            .set("Cookie", `token=${token}`)
            // console.log(res.body)
            expect(res.status).toBe(200)
            expect(res.body.msg).toBe('Deleted Successfully')
        })
    })
})