const Joi = require('joi');

const userValidate = async (req, res, next) => {
    const payload = req.body
    try {
        await schema.validateAsync(payload)
        next()
    } catch (error) {
        console.log(error)
        res.status(406).json({error : error.details[0].message})
    }
}

const schema = Joi.object({
    username: Joi.string().min(0).allow('').allow(null)
        .allow('')
        .allow(null)
        .min(3)
        .max(30)
        .regex(new RegExp, /^\w+(?:\s+\w+)*$/),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    repeat_password: Joi.ref('password'),

    access_token: [
        Joi.string(),
        Joi.number()
    ],

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})

module.exports = userValidate