const { StatusCodes } = require("http-status-codes")
const Auth = require('../models/auth')
const {BadRequestAPIError} = require('../errors')

exports.register = async (req, res) => {
    try {
        const {username, email, password} = req.body

        if (!username || !email || !password) {
           throw new BadRequestAPIError('Please provide all the required parameters!')
        }
       
        const user = await Auth.findOne({email})
       
        if (user) {
           throw new BadRequestAPIError('Email already exist exists please provide a different one')
       }
       
        const newUser = await Auth.create({...req.body})
       
        const token = newUser.createJWT()
       
        res.cookie('token', token, {
            secure: false, // set to true if you're using https || very important
            httpOnly: true,
          })
       
        return res.status(StatusCodes.CREATED).json({newUser, token})
    } catch (error) {
        console.log(error.message)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg : error.message})
    }
}

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body

        if (!email || !password) {
            throw new BadRequestAPIError(`Please provide all the required parameters!`)
        }
    
        const user = await Auth.findOne({email})
    
        if (!user) {
            throw new BadRequestAPIError(`The email supplied does not exist in our database, please provide a different one!`)
        }
    
        const isPasswordCorrect = await user.comparePassword(password)
    
        if (!isPasswordCorrect) {
            throw new BadRequestAPIError(`The password you supplied is incorrect!`)
        }
    
        const token = user.createJWT()
        
        res.cookie('token', token, {
            secure: false, // set to true if you're using https || very important
            httpOnly: true,
          })
    
        return res.status(StatusCodes.OK).json({user, token})
    } catch (error) {
        console.log(error.message)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg : error.message})
    }
}