const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../app')
const Auth = require('../models/auth')

require('dotenv').config()

jest.setTimeout(30000);// timeout set to 30 seconds

describe('API endpoints', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI, {useUnifiedTopology: true, useNewUrlParser: true})
        
          // Check if the connection is open before running any tests

        const connection = mongoose.connection;
        
        if (!connection.readyState) {
            throw new Error('MongoDB connection is not open');
        }
    });
    
      afterAll(async () => {
        await Auth.deleteMany();
        await mongoose.connection.close();
});

    describe('Post /register', () => {
        it('Should register a new user', async () => {
          const res = await request(app)
            .post('/register')
            .send({
              username: 'Steve2',
              email: 'steve2@gmail.com',
              password: 'steve2'
            });
      
          expect(res.status).toBe(201);
          expect(res.body).toHaveProperty('newUser');
          expect(res.body.newUser.username).toBe('Steve2');
          expect(res.body).toHaveProperty("token");
        });
      }); 
      
    describe('Post /login', () => {
        it('Should login an existing user', async () => {
            const res = await request(app)
                .post('/login')
                .send({
                    username: 'Steve2',
                    email: 'steve2@gmail.com',
                    password: 'steve2'
                })
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('user')
            expect(res.body.user.username).toBe('Steve2')
            expect(res.body).toHaveProperty('token')
        })
    })
})