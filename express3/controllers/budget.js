const Budget = require('../models/budget')
const jwt = require('jsonwebtoken')
const { BadRequestAPIError, NotFoundAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

exports.createBudget = async (req, res) => {
    try {
        const cookie = req.headers.cookie
        if (!cookie) {
            throw new NotFoundAPIError(`Token is absent`)
        }

        const token = cookie.split('=')[1]
        
        const payload = jwt.verify(token, process.env.JWT_SECRET)

        const createdBy = payload.username

        const newBudget = await Budget.create({...req.body, createdBy})

        if (!newBudget) {
            throw new BadRequestAPIError(`Please provide all the required parameters`)
        }
    
        return res.status(StatusCodes.CREATED).json({newBudget})
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
    }
}

exports.getSingleBudget = async (req, res) => {
   try {
        const {id : budgetId} = req.params

        const budget = await Budget.findOne({_id : budgetId})

        if (!budget) {
            throw new NotFoundAPIError(`No budget found with id ${budgetId}`)
        }

        return res.status(StatusCodes.OK).json({budget})
   } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
   }
}

exports.getAllBudgets = async (req, res) => {
    // try {
    //     const allBudgets = await Budget.find({})

    //     return res.status(StatusCodes.OK).json({allBudgets, total_budget : allBudgets.length})
    // } catch (error) {
    //     console.log(error)
    //     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
    // }

    try {
        const {name, sort, field, priceFilter} =  req.query
        
        let queryObject = {}

        if (name) {
            queryObject.budgetName = {$regex : name, $options : 'xi'}
        }

        if (priceFilter) {
            const operatorMap = {
                "<" : "$lt",
                "<=" : "$lte",
                "=" : "$eq",
                ">" : "$gt",
                ">=" : "$gte"
            }

            const regEx = /\b(<|<=|=|>|>=)\b/g

            let filter = priceFilter.replace(regEx, (match) => `*${operatorMap[match]}*`)
            console.log(filter)

            const options = ['budgetCost']

            filter = filter.split(',').forEach((item) => {
                const [fields, regex, value] = item.split('*')
                if (options.includes(fields)) {
                    queryObject[fields] = {[regex] : Number(value)}
                    console.log(queryObject)
                }
            })
        }

        let result = Budget.find(queryObject)

        if (sort) {
            let sortList = sort.split(',').join(' ')
            result = result.sort(sortList)
        }

        else {
            result = result.sort('budgetName')
        }

        if (field) {
            let fieldList = field.split(',').join(' ')
            result = result.select(fieldList)
        }

        const budgets = await result
        
        return res.status(StatusCodes.OK).json({total : budgets.length, budgets})
        
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.OK).json({error})
    }
}

exports.updateBudget = async (req, res) => {
   try {

    const {params : {id : budgetId}, body : {budgetName, budgetExpense}} = req

    const cookie = req.cookies.token 

    const payload = jwt.verify(cookie, process.env.JWT_SECRET)

    const updatedBy = payload.username

    req.body.updatedBy = updatedBy

    if (!budgetName || !budgetExpense || !updatedBy) {
        throw new BadRequestAPIError('Please provide all the required parameters')
    }

    const updateBudget = await Budget.findByIdAndUpdate({_id : budgetId}, req.body , {new : true, runValidators : true}) 

    return res.status(StatusCodes.CREATED).json({updateBudget})
   } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
   }
}

exports.deleteBudget = async (req, res) => {
    try {
        const {id : budgetId} = req.params

        const cookie = req.cookies.token

        const payload = jwt.verify(cookie, process.env.JWT_SECRET)

        const deletedBy = payload.username

        const deleteBudget = await Budget.findByIdAndDelete({_id : budgetId})
    
        if (!deleteBudget) {
            throw new NotFoundAPIError(`No budget with id ${budgetId}`)
        }
    
        return res.status(StatusCodes.OK).json({msg : `Budget deleted successfully!...`, deletedBy})
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
    }
}