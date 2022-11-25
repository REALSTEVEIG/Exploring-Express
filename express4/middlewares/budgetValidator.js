const { StatusCodes } = require('http-status-codes')
const Joi = require('joi')

const budgetValidator = async (req, res, next) => {
    try {
        const payload = req.body
        await budgetSchema.validateAsync(payload)
        next()
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({error : error.details[0].message})
    }
}

const budgetSchema = Joi.object({
    budgetName : Joi.string()
        .required(),

    price : Joi.number()
        .required()
})

module.exports = budgetValidator