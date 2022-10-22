const { StatusCodes } = require('http-status-codes')
const { BadRequestAPIError, UnauthenticatedAPIError } = require('../errors')
const Auth = require('../models/auth')

exports.registerUser = async (req, res) => {
    try {
        const {username, email, password} = req.body
    
        if (!username || !email || !password) {
            throw new BadRequestAPIError('Please provide all the required parameters')
        }
    
        const user = await Auth.findOne({email})
    
        if (user) {
            throw new BadRequestAPIError('Email already exists, Please choose another email!') 
        }
    
        const newUser = await Auth.create({...req.body})

        const token = newUser.createJWT()

        res.cookie('token', token, {httpOnly : true, secured : false})

        return res.status(StatusCodes.CREATED).json({newUser, token})
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
    }
}

exports.loginUser = async (req, res) => {
    try {   
        const {email, password} = req.body

        if (!email || !password) {
            throw new BadRequestAPIError('Please provide all the required parameters')
        }
        const user = await Auth.findOne({email})

        if (!user) {
            throw new BadRequestAPIError(`${req.body.email} does not exist as a user in our database. Please provide your correct email address or signup instead`)
        }

        const isPasswordCorrect = await user.comparePasswords(password)

        if (!isPasswordCorrect) {
            throw new UnauthenticatedAPIError('Password is incorrect')
        }

        const token = user.createJWT()

        res.cookie('token', token, {httpOnly : true, secured : false})

        return res.status(StatusCodes.OK).json({user, token})

    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
    }
}

