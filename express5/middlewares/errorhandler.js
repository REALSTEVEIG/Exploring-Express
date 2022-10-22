const { StatusCodes } = require("http-status-codes")

const errorHandlerMiddleware = (err, req, res) => {
    const customError = {
        statusCode : err.satusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg : err.message || `Internal server error`
    }

    if (err.name === `Validation Error`) {
        customError.msg = Object.values(err.errors)
            .map((item) => item.message)
            .join(',')
        customError.statusCode = StatusCodes.BAD_REQUEST
    } 

    if (err.code && err.code === 11000) {
        customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)}
            field, please provide another ${Object.keys(err.keyValue)}`
        customError.statusCode = StatusCodes.BAD_REQUEST
    }

    if (err.name === 'CastError') {
        customError.msg = `No item found with id : ${err.value}`
        customError.statusCode = StatusCodes.NOT_FOUND
    }

    return res.status(customError.statusCode).json({msg : customError.msg})
}

module.exports = errorHandlerMiddleware