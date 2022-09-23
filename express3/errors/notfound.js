const CustomAPIError = require('./customerror')
const {StatusCodes} = require('http-status-codes')

class NotFoundAPIError extends CustomAPIError {
    constructor (message) {
        super (message)
        this.statusCodes = StatusCodes.NOT_FOUND
    }
}

module.exports = NotFoundAPIError