const User = require('../models/auth')
const {StatusCodes} = require('http-status-codes')
const catchAsync = require('../util/catchAsync')
const JWT = require('jsonwebtoken')

exports.sign_up = async (req, res) => {
    try {    
        const userEmail = await User.findOne({email : req.body.email})

        if (userEmail) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({error : `Email already exists!`})
        }

        const newUser = await User.create({...req.body})
        newUser.password = undefined
        const token = newUser.createJWT()
        return res
            .status(StatusCodes.CREATED).json({newUser, token})
    } catch (error) {
        console.log(error)
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({error : error.message})
    }
}

exports.log_in = async (req, res) => {
    try {
        const {email, password} = req.body

        const user = await User.findOne({email})

            if (!user) {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({error : `User not found!`})
            }

        const passwordCorrect = await user.comparePasswords(password)

        if (!passwordCorrect) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({error : `Password is incorrect!`})
        }

        const token = await user.createJWT()
        
        user.password = undefined


        return res
            .status(StatusCodes.OK)
            .json({user, token})
    } catch (error) {
        console.log(error)
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({error : error.message})
    }
}

exports.protect = catchAsync(async (req, res, next) => {
    if (
      !req.headers ||
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      return res.status(401).json({error : 'Please provide a token!'})
    }
    const token = req.headers.authorization.split(" ")[1];
    const decoded = await JWT.verify(token, process.env.JWT_SECRET);
    if (!decoded) return next(new AppError("Token is invalid", 401));
    const user = await User.findById(decoded.id);
    // console.log(user)
    if (!user) {
      return next(new AppError("user does not exist", 401));
    }
    req.user = user;
    next();
  });