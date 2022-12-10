const { StatusCodes } = require("http-status-codes")
const Budget = require('../models/budget')
const catchAsync = require("../util/catchAsync");

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
        
    } catch (error) {
        
    }
}

exports.getAllBudgets = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

exports.updateBudget = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

exports.deleteBudget = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}