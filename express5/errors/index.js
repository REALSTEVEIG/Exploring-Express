const BadRequestAPIError = require('./badrequest')
const CustomAPIError = require('./customerror')
const NotFoundAPIError = require('./notfound')
const UnauthenticatedAPIError = require('./unauthenticated')

module.exports = {
    BadRequestAPIError,
    CustomAPIError,
    NotFoundAPIError,
    UnauthenticatedAPIError
}