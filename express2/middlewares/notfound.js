const { StatusCodes } = require("http-status-codes")

const notfound = (error, req, res) => {
    console.log(error)
    return res.status(StatusCodes.NOT_FOUND).json({msg : `This resource was not found!`})
}

module.exports = notfound