require('dotenv').config()

const mongoose = require('mongoose')
const app = require('../app')
const request = require('supertest')
const Budget = require('../models/budget')
const Auth = require('../models/auth')

let id
let token

jest.setTimeout(30000)

describe('API endpoints', () => {
    beforeAll( async () => {
        await mongoose.connect(process.env.MONGODB_URI)

        const connection = mongoose.connection

        if (!connection.readyState) {
            throw new Error('MongoDB is not connected')
        }

        const res = await request(app)
            .post("/register")
            .send({ 
                username : 'steve2',
                email: "steve2@gmail.com", 
                password: "steve2" 
            });

        // console.log(res.body)
        token = res.body.token
    })

    afterAll( async () => {
        await Auth.deleteMany()
        await Budget.deleteMany()
        await mongoose.connection.close()
        jest.clearAllMocks()
    })

    describe('Post /budget', () => {
        it('Should create a new budget', async () => {
            const res = await request(app)
                .post('/budget')
                .set("Cookie", `token=${token}`)
                .send({
                    budgetName : 'Shoe',
                    budgetExpense : '$500'
                })
                // console.log(res.body)
                expect(res.status).toBe(201)
                expect(res.body.newBudget.budgetName).toBe('Shoe')
                id = res.body.newBudget._id
        })
    })

    describe('Get /budget', () => {
        it('Should get all budgets', async () => {
            const res = await request(app)
                .get('/budget')
                .set("Cookie", `token=${token}`)
                // console.log(res.body)
                expect(res.status).toBe(200)
                expect(res.body.budgets.length).toBeGreaterThan(0)
        })
    })

    describe('Get /budget/:id', () => {
        it('Should get a single budget', async () => {
            const res = await request(app)
                .get(`/budget/${id}`)
                .set("Cookie", `token=${token}`)
                expect(res.status).toBe(200)
                expect(res.body.budget.budgetName).toBe('Shoe')
        })
    })

    describe('Update /budget/:id', () => {
        it('Should update a budget', async () => {
            const res = await request(app)
                .patch(`/budget/${id}`)
                .set("Cookie", `token=${token}`)
                .send({
                    budgetName : 'Bag'
                })
                // console.log(res.body)
                expect(res.status).toBe(201)
                expect(res.body.updateBudget.budgetName).toBe('Bag')
        })
    })

    describe('Delete /budget/:id', () => {
        it('Should delete a budget', async () => {
            const res = await request(app)
                .delete(`/budget/${id}`)
                .set("Cookie", `token=${token}`)
                // console.log(res.body)
                expect(res.status).toBe(200)
                expect(res.body.msg).toBe('Budget deleted successfully!...')
        })
    })
})