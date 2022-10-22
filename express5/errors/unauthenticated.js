const CustomAPIError = require('../errors/customerror')
const {StatusCodes} = require('http-status-codes')

class UnauthenticatedAPIError extends CustomAPIError {
    constructor (message) {
        super (message)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}

module.exports = UnauthenticatedAPIError