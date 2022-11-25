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
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    featured : Joi.boolean()
        .required(),

    price : Joi.number()
        .required()
})


module.exports = budgetValidate