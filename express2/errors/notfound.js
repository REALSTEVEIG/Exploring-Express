const {StatusCodes} = require('http-status-codes')
const CustomAPIError = require('./customerror')

class NotFoundAPIError extends CustomAPIError{
    constructor(message) {
        super(message)
        this.statusCode = StatusCodes.NOT_FOUND
    }
}

module.exports = NotFoundAPIError