const { StatusCodes } = require("http-status-codes")

const errorHandlerMiddleware = (err, req, res) => {
    const customError = {
        statusCode : errorHandlerMiddleware.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg : err.message || `Something went wrong, please try again later..`
    }    

    if (err.name === `ValidationError`) {
        customError.msg = Object.values(err.errors).map((items) => item.message).join(',')
        customError.statusCode = StatusCodes.BAD_REQUEST
    }

    if (err.code && err.code === 11000) {
        customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`
        customError.statusCode = StatusCodes.BAD_REQUEST
    }

    if (err.name === `CastError`) {
        customError.msg = `No item found with id : ${err.value}`
        customError.statusCode = StatusCodes.NOT_FOUND
    }
    return res.status(customError.statusCode).json({msg : customError.msg})
}

module.exports = errorHandlerMiddleware