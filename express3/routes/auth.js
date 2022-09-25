const routeMiddleware = require('../middleware/router')

const {registerUser, loginUser} = require('../controllers/auth')

routeMiddleware.route('/register').post(registerUser)
routeMiddleware.route('/login').post(loginUser)

module.exports = routeMiddleware