const {StatusCodes} = require('http-status-codes')

const authMiddleware = (err, req, res, next) => {
    const cookie = req.cookies.token

    if (!cookie) {
        return res.status(StatusCodes.NOT_FOUND).json({msg : `No cookie found`})
    }

    if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : err.message})
    }

    next()
}

module.exports = authMiddleware