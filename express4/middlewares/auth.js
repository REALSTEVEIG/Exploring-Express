const jwt = require('jsonwebtoken')
const { UnauthenticatedAPIError, NotFoundAPIError } = require("../errors")

const authHandlerMiddleware = (err, req, res, next) => {
    const cookie = req.cookie.token
        if (!cookie) {
            throw new NotFoundAPIError('No cookie present')
        }

        if (err) {
            throw new UnauthenticatedAPIError('We cannot authenticate this request for now!')
        }

        next()
} 

module.exports = authHandlerMiddleware