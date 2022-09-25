const { StatusCodes } = require("http-status-codes")
const { NotFoundAPIError, BadRequestAPIError } = require("../errors")
const Auth = require("../models/auth")

exports.registerUser = async (req, res) => {
    try {
        const {username, email, password} = req.body

        if (!username || !email || !password) {
            throw new BadRequestAPIError('error : `Please provide all the required parameters`')
        }

        const user = await Auth.findOne({email})

        if (user) {
            throw new NotFoundAPIError(`The email : ${req.body.email} already exists in our database, please provide a different one`)
        }

        const newUser = await Auth.create({...req.body})

        const token = newUser.createJWT()

        res.cookie('token', token, {httpOnly : true, secure : false,  maxAge : process.env.JWT_LIFETIME})
        return res.status(StatusCodes.CREATED).json({createdUser : newUser, token})
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
        throw new NotFoundAPIError(`No user with email ${req.body.email}`)
    }

    const suppliedPassword = await user.comparePassword(password)

    if (!suppliedPassword) {
        throw new BadRequestAPIError(`Password supplied is incorrect!`)
    }

    const token = user.createJWT()

    res.cookie('token', token, {secure: false, httpOnly : true, maxAge : process.env.JWT_LIFETIME})

    return res.status(StatusCodes.OK).json({user, token})
    
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
  }
}