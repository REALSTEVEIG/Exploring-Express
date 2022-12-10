const express = require('express')
const router = express.Router()

const {sign_up, log_in} = require('../controllers/auth')
const {getAllUsers, getSingleUser} = require('../controllers/user')
const userValidation = require('../util/uservalidation')

//AUTH ROUTE
router.route('/register').post(userValidation, sign_up)
router.route('/login').post(log_in)

//USERS ROUTE
router.route('/users').get(getAllUsers)
router.route('/users/:id').get(getSingleUser)

module.exports = router

