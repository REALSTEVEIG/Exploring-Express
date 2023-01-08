const Joi = require('joi')

const budgetValidate = async (req, res, next) => {
  
    try {
        const payload = req.body
        await budgetSchema.validateAsync(payload)
        next()
    } catch (error) {
        console.log( error.details[0].message )
        return res.status(406).json({error : error.details[0].message})
    }
    
}

const budgetSchema = Joi.object({
    budgetName: Joi.string()
        .allow('')
        .allow(null)
        .min(3)
        .max(30)
        .regex(new RegExp, /^\w+(?:\s+\w+)*$/),

    price : Joi.number()
        .required()
})


module.exports = budgetValidate