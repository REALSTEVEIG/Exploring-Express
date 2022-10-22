const { StatusCodes } = require('http-status-codes')
const { BadRequestAPIError, NotFoundAPIError } = require('../errors')
const Budget = require('../models/budget')
const jwt = require('jsonwebtoken')

exports.createBudget = async (req, res) => {
   try {
        const token = req.cookies.token

        const payload = jwt.verify(token, process.env.JWT_SECRET)

        const createdBy = payload.username

        const {budgetName, budgetPrice} = req.body

        if (!budgetName || !budgetPrice) {
            throw new BadRequestAPIError('Please provide all the required parameters')
        }

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
        
        const token = req.cookies.token

        const payload = jwt.verify(token, process.env.JWT_SECRET)

        const requestedBy = payload.username

        const getAllBudgets = await Budget.find({})

        if (!getAllBudgets) {
            throw new NotFoundAPIError('No budgets available')
        }

        return res.status(StatusCodes.OK).json({getAllBudgets, count : getAllBudgets.length, requestedBy})
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
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