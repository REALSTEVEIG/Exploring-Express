const express = require('express')
const router = express.Router()

const {register, login, logout} = require('../controllers/users')
const userValidation = require('../middleware/userValidation')

router.route('/register').post(userValidation, register)
router.route('/login').post(login)
router.route('/logout').get(logout)

module.exports = router