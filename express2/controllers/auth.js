const { StatusCodes } = require("http-status-codes")
const { NotFoundAPIError } = require("../../express1/errors")
const { BadRequestAPIError, UnauthenticatedAPIError } = require("../errors")
const Auth = require('../models/auth')


exports.registerUser = async (req, res) => {
    try {
        const {username, email, password} = req.body 

        if (!username || !email || !password) {
            throw new BadRequestAPIError('Please provide all the required parameters')
        }
    
        const suppliedEmail = await Auth.findOne({email})
    
        if (suppliedEmail) {
            throw new BadRequestAPIError('This email already exists in our database, please provide another one')
        }
    
        const newUser = await Auth.create({...req.body})
    
        const token = newUser.createJWT()

        res.cookie('token', token, {httponly : true, secured : false})

        return res.status(StatusCodes.CREATED).json({msg : `User created successfully`, newUser, token})

    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
    }
}


exports.loginUser = async (req, res) => {
    try {
        const {email, password} = req.body 

        if (!email || !password) {
            throw new BadRequestAPIError('Please provide email and password!')
        }
    
        const user = await Auth.findOne({email})
         
        if (!user) {
            throw new NotFoundAPIError(`No user with the email you supplied!`)
        }
    
        const comparePassword = await user.comparePassword(password)
    
        if (!comparePassword) {
            throw new BadRequestAPIError(`Password is incorrect please input password again`)
        }
    
        const token = user.createJWT()
    
        res.cookie('token', token, {httponly : true, secured : false})
    
        return res.status(StatusCodes.OK).json({LoggedIn : `Welcome back`, user, token})
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
    }
}