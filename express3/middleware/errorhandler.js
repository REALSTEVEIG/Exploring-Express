const { StatusCodes } = require("http-status-codes")

const errorHandlerMiddleware = (req, res) => {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg : 'There has been an error in our server, Please try again later' })
}

module.exports = errorHandlerMiddleware