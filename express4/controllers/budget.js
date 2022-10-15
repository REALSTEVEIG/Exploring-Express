const { BadRequestAPIError } = require("../errors")
const Budget = require('../models/budget')
const jwt = require('jsonwebtoken')
const { StatusCodes } = require("http-status-codes")

exports.createBudget = async (req, res) => {
    try {
        const cookie = req.headers.cookie

        const token = cookie.split('=')[1]

        const payload = jwt.verify(token, process.env.JWT_SECRET)

        const createdBy = payload.username

        const {budgetName, budgetCost} = req.body

        if (!budgetName || !budgetCost) {
            throw new BadRequestAPIError('Please provide budget name and cost!')
        }
    
        const newBudget = await Budget.create({...req.body, createdBy})   

        return res.status(StatusCodes.CREATED).json({newBudget})

    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
    }
}

exports.getAllBudgets = async (req, res) => {
    try {
        const token = req.cookies.token
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        const requestedBy  = payload.username

        const allProducts = await Budget.find()
        res.status(StatusCodes.OK).json({allProducts, count : allProducts.length, requestedBy})
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
    }
}

exports.getSingleBudget = async (req, res) => {
    try {
        const cookie = req.cookies.token
        const payload = jwt.verify(cookie, process.env.JWT_SECRET)
        const requestedBy = payload.username

        const {id : budgetId} = req.params

        const getSingleBudget = await Budget.findOne({_id : budgetId})

        if (!budgetId) {
            throw new BadRequestAPIError(`No budget with id ${budgetId}`)
        }

        return res.status(StatusCodes.OK).json({getSingleBudget, requestedBy})
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
    }
}

exports.updateBudget = async (req, res) => {
  try {
    const {params : {id : updateBudget}, body: {budgetName, budgetCost}} = req

    if (!budgetName || !budgetCost) {
        throw new BadRequestAPIError('Please provide all the required parameters')
    }

    const newBudget = await Budget.findByIdAndUpdate({_id : updateBudget}, req.body, {runValidators : true, new : true})

    return res.status(StatusCodes.OK).json({newBudget})
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
  }
}

exports.deleteBudget = async (req, res) => {
    try { 
        const cookie = req.cookies.token
        const payload = jwt.verify(cookie, process.env.JWT_SECRET)
        const deletedBy = payload.username

        const {id : budgetId} = req.params 

        const deleteBudget = await Budget.findByIdAndDelete({_id : budgetId})

        if (!deleteBudget) {
            throw new BadRequestAPIError(`No product with id ${budgetId}`)
        }

        return res.status(StatusCodes.OK).json({message : `Successfully deleted the budget`, deletedBy})
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
    }
    
}