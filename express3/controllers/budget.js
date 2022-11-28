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
    try {
            
        const {name, author, sort, filterPrice} = req.query

        let queryObject = {}

        if (name) {
            queryObject.budgetName = {$regex : name, $options : 'ix'}
        }

        if (author) {
            queryObject.createdBy = {$regex : author, $options : 'xi'} 
        }

        if (filterPrice) {
            const operatorMap = {
                "<" : "$lt",
                "<=" : "$lte",
                "=" : "$eq",
                ">" : "$gt",
                ">=" : "$gte",
            }

            const regEx = /\b(<|<=|=|>|>=)\b/g

            let filter = filterPrice.replace(regEx, (match) => `*${operatorMap[match]}*`)

            const options = ['price']

            filter = filter.split(',').forEach((el) => {
                const [fields, regex, value] = el.split('*')
                if(options.includes(fields)) {
                    queryObject[fields] = {[regex] : Number(value)}
                }
            })
        }

        let result = Budget.find(queryObject)

        if (sort) {
            const sortList = sort.split(',').join(' ')
            result = result.sort(sortList)
        }
        
        else {
            result = result.sort('budgetName')
        }

        const page = req.query.page || 1
        const limit = req.query.limit || 10
        const skip = (page -1) * limit

        result = result.skip(skip).limit(limit)

        const budgets = await result
        console.log(queryObject)
        
        return res.status(StatusCodes.OK).json({total : budgets.length, budgets})
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
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