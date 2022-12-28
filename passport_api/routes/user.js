const express = require('express')
const router = express.Router()
// const passport = require('passport')

const {register, login} = require('../controllers/users')

router.route('/register').post(register)
router.route('/login').post(login)

module.exports = router