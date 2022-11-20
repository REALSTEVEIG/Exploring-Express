const { StatusCodes } = require('http-status-codes')
const { BadRequestAPIError, NotFoundAPIError } = require('../errors')
const Budget = require('../models/budget')
const jwt = require('jsonwebtoken')

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
    // try {
    //     const {name, sort, numericFilters} = req.query

    //     let queryObject = {}

    //     if (name) {
    //         queryObject.budgetName = {$regex : name, $options : "xi"}
    //     }

    //     if (numericFilters) {
    //         console.log(queryObject)

    //         const operatorMap = {
    //             '>' : '$gt',
    //             '>=' : '$gte',
    //             '=' : '$eq',
    //             '<' : '$lt',
    //             '<=' : '$lte',
    //         }

    //         const regEx = /\b(>|>=|=|<|<=)\b/g

    //         let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`)
    //         console.log(filters)
            
    //         const options = ["price"]

    //         filters = filters.split(',').forEach((item) => {
    //             const [query, regex, value] = item.split('-')
    //             if (options.includes(query)) {
    //                 queryObject[query] = {[regex]:Number(value)}
    //             }
    //         })
    //         console.log(numericFilters)
    //     }

    //     let result = Budget.find(queryObject)

    //     if (sort) {
    //         const sortList = sort.split(',').join(' ')
    //         result = result.sort(sortList)
    //     }

    //     else {
    //         result = result.sort('_id')
    //     }

    //     const page = req.query.page || 1
    //     const limit = req.query.limit || 10
    //     const skip = (page -1) * limit

    //     result = result.skip(skip).limit(limit)

    //     const budgets = await result

    //     return res.status(StatusCodes.OK).json({total : budgets.length, budgets})
    // } catch (error) {
    //     console.log(error)
    //     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    // }

    try {
        const {name, sort, amount} = req.query

        let queryObject = {}

        if (name) {
            queryObject.budgetName = {$regex : name, $options : 'xi'}
        }

        if (amount) {
            const operatorMap = {
                "<" : "$lt",
                "<=" : "$lte",
                "=" : "$eq",
                ">" : "$gt",
                ">=" : "$gte",
            }

            const regEx = /\b(<|<=|=|>|>=)\b/g

            let filter = amount.replace(regEx, (match) => `*${operatorMap[match]}*`)
            console.log(filter)
            
            const options = ['price']

            filter = filter.split(',').forEach((item) => {
                const [fields, regex, value] = item.split('*')
                if (options.includes(fields)) {
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
            result = result.sort('-budgetName')
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