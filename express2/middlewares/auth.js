const jwt = require('jsonwebtoken')
const {UnauthenticatedAPIError} = require('../errors')

const authenticationMiddleware = (req, res, next) => {
    try {
        const cookie = req.headers.cookie

        if (!cookie || !cookie.startsWith('token')) {
            throw new UnauthenticatedAPIError(`Token is absent!`)
        }
    
        const token = cookie.split('=')[1]
    
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {userId : payload.userId, username : payload.username}
        next()
    } catch (error) {
        console.log(error)
        throw new UnauthenticatedAPIError(`Authentication failed!`)
    }
}

module.exports = authenticationMiddleware