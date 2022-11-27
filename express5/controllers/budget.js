const { StatusCodes } = require('http-status-codes')
const { BadRequestAPIError, NotFoundAPIError } = require('../errors')
const Budget = require('../models/budget')
const jwt = require('jsonwebtoken')
const APIfeatures = require('../util/apifeatures')

exports.createBudget = async (req, res) => {
   try {
        const token = req.cookies.token

        const payload = jwt.verify(token, process.env.JWT_SECRET)

        const createdBy = payload.username

        const newBudget = await Budget.create({...req.body, createdBy})

        return res.status(StatusCodes.CREATED).json({newBudget})
   } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
   }

}

exports.getSingleBudget = async (req, res) => {
   try {

        const token = req.cookies.token

        const payload = jwt.verify(token, process.env.JWT_SECRET)

        const requestedBy = payload.username

        const {id : budgetId} = req.params

        const singleBudget = await Budget.findOne({_id : budgetId})

        if (!singleBudget) {
            throw new NotFoundAPIError(`No budget with id ${budgetId}`)
        }
        
        return res.status(StatusCodes.OK).json({singleBudget, requestedBy})
   } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error :  error.message})
   }
}

exports.getAllbudgets = async (req, res) => {
    try {
        console.log(req.query)
        const features =  new APIfeatures(Budget.find({}), req.query)
        .limitFields()
        .paginate()
        .filter()
        .sort()

        console.log(req.query)

        const budgets = await features.query
 
         return res.status(StatusCodes.OK).json({total : budgets.length, budgets})
 } catch (error) {
         console.log(error)
         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    }
}

exports.updateBudget = async (req, res) => {
    try {

        const token = req.cookies.token

        const payload = jwt.verify(token, process.env.JWT_SECRET)

        const requestedBy = payload.username

        const {params : {id : budgetId}, body : {budgetName, budgetPrice}} = req

        if (!budgetName || !budgetPrice) {
            throw new BadRequestAPIError('Please provide all the required parameters')
        }

        const updateBudget = await Budget.findByIdAndUpdate({_id : budgetId}, req.body, {runValidators : true, new : true})

        return res.status(StatusCodes.CREATED).json({updateBudget, requestedBy})
    
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
    }
}  

exports.deleteBudget = async (req, res) => {
    try {
        
        const token = req.cookies.token

        const payload = jwt.verify(token, process.env.JWT_SECRET)

        const deletedBy = payload.username

        const {id : budgetId} = req.params

        const deleteBudget = await Budget.findOneAndDelete({_id : budgetId})

        if (!deleteBudget) {
            throw new NotFoundAPIError(`There is no budget with id ${budgetId}`)
        }

        return res.status(StatusCodes.OK).json({message : `Budget deleted successfully`, deletedBy})
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
    }
}