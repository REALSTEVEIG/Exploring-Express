const {StatusCodes} = require('http-status-codes')
const CustomAPIError = require('./customerror')

class UnauthenticatedAPIError extends CustomAPIError{
    constructor(message) {
        super(message)
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}

module.exports = UnauthenticatedAPIError