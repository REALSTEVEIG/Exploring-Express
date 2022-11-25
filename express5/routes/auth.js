const express = require('express')
const router = express.Router()
const userValidate = require('../middlewares/userValidate')

const {registerUser, loginUser} = require('../controllers/auth')

router.route('/register').post(userValidate, registerUser)
router.route('/login').post(loginUser)

module.exports = router