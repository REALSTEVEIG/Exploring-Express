const { StatusCodes } = require("http-status-codes")
const { BadRequestAPIError } = require("../errors")
const Auth = require('../models/auth')

exports.registerUser =  async (req, res) => {
    try {
        const {username, email, password} = req.body

        if (!username || !email || !password) {
            throw new BadRequestAPIError('Please provide all the required parameters')
        }
    
        const user = await Auth.findOne({email})
    
        if (user) {
            throw new BadRequestAPIError('A user already exists with the supplied email.')
        }
        
        const newUser = await Auth.create({...req.body})

        const token = newUser.createJWT()

    
        res.cookie('token', token, {httpOnly : true, secured : false})

        return res.status(StatusCodes.CREATED).json({newUser : newUser, token})
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
    }
}

exports.loginUser =  async (req, res) => {
    try {
        const {email, password} = req.body

        if (!email || !password) {
            throw new BadRequestAPIError('Please provide all the required parameters')
        }

        const user = await Auth.findOne({email})

        if (!user) {
            throw BadRequestAPIError('The email you supplied does not exist in our database. Please proveide a different one')
        }

        const comparePassword = await user.comparePassword(password)

        if (!comparePassword) {
            throw new BadRequestAPIError(`Password mismatch. Please try again`)
        }

        const token = user.createJWT()

        res.cookie('token', token, {httpOnly : true, secured : false})

        return res.status(StatusCodes.OK).json({user, token})

    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
    }
}