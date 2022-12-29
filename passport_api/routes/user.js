const express = require('express')
const router = express.Router()

const {register, login, logout} = require('../controllers/users')
const userValidation = require('../middleware/userValidation')

const rateLimit = require('express-rate-limit')

//rate-limiting
const limiter = rateLimit({
	windowMs: 60 * 1000, // 1 minutes
	max: 5, // Limit each IP to 5 requests per `window` (here, per 1 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message:
		'Too many logins initiated from this IP, please try again after a minute'
})

router.route('/register').post(userValidation, register)
router.route('/login').post(limiter, login)
router.route('/logout').get(logout)

module.exports = router