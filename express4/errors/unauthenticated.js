const { StatusCodes } = require('http-status-codes')
const CustomAPIError = require('./customerror')

class UnauthenticatedAPIError extends CustomAPIError {
    constructor (message) {
        super (message) 
        this.statusCode = StatusCodes.unauthenticatedAPIError
    }
}

module.exports  = UnauthenticatedAPIError