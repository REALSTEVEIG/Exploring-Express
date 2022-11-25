const express = require('express')
const router  = express.Router()
const authValidator = require('../middlewares/userValidator')

const {registerUser, loginUser} = require('../controllers/auth')

router.route('/register').post(authValidator, registerUser)
router.route('/login').post(loginUser)


module.exports = router