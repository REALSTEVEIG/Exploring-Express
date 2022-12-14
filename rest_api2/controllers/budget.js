const { StatusCodes } = require("http-status-codes")
const Budget = require('../models/budget')
const catchAsync = require("../util/catchAsync");
const User = require('../models/auth')

exports.setOwnerId = catchAsync(async (req, res, next) => {
    req.body.owner = req.user.username;
    next();
  });

  exports.createBudget = catchAsync(async (req, res, next) => {
    try {
        const newBudgetToCreate = {
            owner : req.body.owner,
            budget_name : req.body.budget_name,
            budget_price : req.body.budget_price
          };
        const newBudget = await Budget.create(newBudgetToCreate)

        if (!newBudget) {
            return next(new AppError("Blog could not be created", 400));
          }

        return res
            .status(StatusCodes.CREATED)
            .json({newBudget})
    } catch (error) {
        console.log(error)
        return res
            .status(500)
            .json({error : error.message})
    }
}) 

exports.getSingleBudget = async (req, res) => {
    try {
        const singleBudget = await Budget.findById(req.params.id)

        if (!singleBudget) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({error : `Budget with id ${req.params.id} does not exist`})
        }

        return res.status(StatusCodes.OK).json({singleBudget})

    } catch (error) {
        console.log(error)
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({error : error.message})
    }
}

exports.getAllBudgets = async (req, res) => {
    try {
        const {filter, sort, fields, numerical} = req.query

        let queryString = {}

        if (req.query.filter) {
            queryString.budget_name = {$regex : filter, $options : 'xi'}
        }

        if (numerical) {
            const operatorMap = {
                '<' : '$lt',
                '<=' : '$lte',
                '=' : '$eq',
                '>' : '$gt',
                '>=' : '$gte'
            }

            const regex = /\b(<|<=|=|>|>=)\b/g

            let filter = numerical.replace(regex, (match) => `*${operatorMap[match]}*`)
            console.log(filter)

            const options = ['budget_price']

            filter = filter.split(',').forEach((item) => {
                const [fields, regex, value] = item.split('*')
                if (options.includes(fields)) {
                    queryString[fields] = {[regex] : Number(value)}
                }
            })
        }

        let result = Budget.find(queryString)

        if (req.query.sort) {
            const sortList = sort.split(',').join(' ')
            result = result.sort(sortList)
        }

        else {
            result = result.sort('budget_name')
        }

        if (req.query.fields) {
            const fieldsList = fields.split(',').join(' ')
            result = result.select(fieldsList)
        }

        const page = req.query.page || 1
        const limit = req.query.limit || 5
        const skip = (page - 1) * limit

        result = result.skip(skip).limit(limit)

        console.log(queryString)

        let findAll = await result
  
        return res.status(StatusCodes.OK).json({total : findAll.length ,findAll})
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

exports.updateBudget = async (req, res) => {
    try {

    let budget = await Budget.findOne({_id : req.params.id})

    if (!budget) {
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({error : `No budget with id ${req.params.id}`})
    }

    console.log(req.user.username, budget.owner)

    if (req.user.username !== budget.owner) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({error : `You are not the owner of this blog, hence updating it is impossible`})
    }

    if (req.body.budget_name) {
        budget.budget_name = req.body.budget_name
    }

    if (req.body.budget_price) {
        budget.budget_price = req.body.budget_price
    }

    const update = await budget.save()

    if (!update) {
        return res
            .status(StatusCodes.NOT_FOUND)
            .json({error : `Blog not found!`})
    }

    return res
        .status(StatusCodes.OK)
        .json({update})

    } catch (error) {
      console.log(error)
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({error : error.message}) 
    }
}

exports.deleteBudget = async (req, res) => {
    try {
        let budget = await Budget.findById(req.params.id)

        if (!budget) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({error : `No budget with id ${req.params.id}`})
        }

        if (req.user.username !== budget.owner) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({error : `You are not the owner of this blog, hence not permitted to delete it`})
        }

        const deleteBudget = await Budget.findByIdAndDelete(budget)

        return res
            .status(StatusCodes.OK)
            .json({Message : `Blog deleted successfully!`})

    } catch (error) {
        console.log(error)
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({error : error.message})
    }
}