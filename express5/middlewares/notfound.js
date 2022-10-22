const { StatusCodes } = require("http-status-codes")

const notFoundMiddleware = (req, res) => {
    return res.status(StatusCodes.NOT_FOUND).json({message : `Resourse not found!`})
}

module.exports = notFoundMiddleware