const CustomAPIError = require('./customerror')
const {StatusCodes} = require('http-status-codes')

class BadRequestAPIError extends CustomAPIError {
    constructor (message) {
        super (message)
        this.StatusCodes = StatusCodes.BAD_REQUEST
    }
}

module.exports = BadRequestAPIError