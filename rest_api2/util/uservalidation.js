const { StatusCodes } = require('http-status-codes');
const Joi = require('joi');

const userValidation = async (req, res, next) => {
    try {
        const payload = req.body
        await schema.validateAsync(payload)
        next()
    } catch (error) {
        console.log(error)
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({error : error.details[0].message})
    }
}

const schema = Joi.object({
    username: Joi.string()
        .regex(new RegExp, /^\w+(?:\s+\w+)*$/)
        .min(3)
        .max(30)
        .required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] }})
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    confirm_password: Joi.ref('password')
})

module.exports = userValidation