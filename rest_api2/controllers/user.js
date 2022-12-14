const { StatusCodes } = require('http-status-codes')
const User = require('../models/auth')
const Budget = require('../models/budget')

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})
        return res
            .status(StatusCodes.OK)
            .json({total : users.length, users})
    } catch (error) {
         console.log(error)
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({error : error.message})
    }
}

exports.getSingleUser = async (req, res) => {
    try {
        const users = await User.findById(req.params.id)
            .populate(
                {path : 'budgets', 
                model : Budget, 
                select: {"budget_name" : 1, "budget_price" : 1}})

            users.password = undefined
        return res
            .status(StatusCodes.OK)
            .json({No_of_budgets : users.budgets.length, User : users})
    } catch (error) {
        console.log(error)
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({error : error.message})
    }
}