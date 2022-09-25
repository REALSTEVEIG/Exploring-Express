const BadRequestAPIError = require('./badrequest')
const CustomAPIError = require('./customerror')
const NotFoundAPIError = require('./notfound')
const UnathenticatedAPIError = require('./unauthenticated')

module.exports = {
    BadRequestAPIError,
    CustomAPIError,
    NotFoundAPIError,
    UnathenticatedAPIError
}