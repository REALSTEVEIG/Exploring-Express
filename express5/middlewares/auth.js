const { StatusCodes } = require("http-status-codes")
const { UnauthenticatedAPIError } = require("../errors")

const authMiddleware = (req, res, next) => {
    try {
        const cookie = req.cookies.token
        if (!cookie) {
            throw new UnauthenticatedAPIError('No access token prosent')
        }

        next()
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
    }
}

module.exports = authMiddleware