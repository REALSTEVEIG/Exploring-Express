const { StatusCodes } = require('http-status-codes')
const Joi = require('joi')

const authValidator = async (req, res, next) => {
    try {
        const payload = req.body

        await authSchema.validateAsync(payload)

        next()
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({error : error.details[0].message})
    }
}

const authSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    repeat_password: Joi.ref('password'),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})

module.exports = authValidator