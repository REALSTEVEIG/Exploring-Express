const { BadRequestAPIError, NotFoundAPIError } = require("../errors")
let jwt = require('jsonwebtoken')
const { StatusCodes } = require("http-status-codes")
const Books = require('../models/books')

exports.createBook = async (req, res) => {
    try {
        const token = req.cookies.token
        const {title, author, price} = req.body

        if (!title || !author || !price) {
            throw new BadRequestAPIError(`Plase provide all the required parameters`)
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET)
        const createdBy =  payload.username
    
        const newBook = await Books.create({...req.body, createdBy})

        return res.status(StatusCodes.CREATED).json({msg : `New book created successflly`, newBook})
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
    }
}


exports.getSingleBook = async (req, res) => {
    try {
        const token = req.cookies.token

        const {id : bookId} = req.params

        const singleBook = await Books.findOne({_id : bookId})
    
        if (!singleBook) {
            throw new NotFoundAPIError(`No book with id ${bookId}`)
        }
    
        const payload = jwt.verify(token, process.env.JWT_SECRET)

        const requestedBy = payload.username

        singleBook.requestedBy = requestedBy

        return res.status(StatusCodes.OK).json({singleBook})
    } catch (error) {
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
    }
}

exports.getAllBooks = async (req, res) => {
    try {

        const cookie = req.headers.cookie

        const token = cookie.split('=')[1]

        const payload = jwt.verify(token, process.env.JWT_SECRET) 

        const requestedBy = payload.username
        
        const allBooks = await Books.find()

        if (!allBooks) {
            throw new NotFoundAPIError('There are no books in your database for now')
        }
    
        return res.status(StatusCodes.OK).json({allBooks, requestedBy, total : allBooks.length})
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
    }
}

exports.updateBook = async (req, res) => {
    try {

        const cookie = req.headers.cookie

        const token = cookie.split('=')[1]

        const payload = jwt.verify(token, process.env.JWT_SECRET)

        const {id : bookId} = req.params

        const updateBook = await Books.findByIdAndUpdate({_id : bookId}, req.body, {new : true, runValidators : true})
    
        if (!updateBook) { 
           throw new NotFoundAPIError(`No book with id ${bookId}`)
        }

        const updatedBy = payload.username

        updateBook.updatedBy = updatedBy

        return res.status(StatusCodes.CREATED).json({updateBook})
        
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
    }

}

exports.deleteBook = async (req, res) => {
    try {
        const cookie = req.headers.cookie

        const token = cookie.split('=')[1]

        const payload = jwt.verify(token, process.env.JWT_SECRET)

        const {id : bookId} = req.params

        const deleteBook = await Books.findByIdAndDelete({_id : bookId})

        const deletedBy = payload.username
     
        if (!deleteBook) {
         throw new NotFoundAPIError(`No book with id ${bookId}`)
        }
     
        return res.status(StatusCodes.OK).json({msg : `Book has been deleted successfully!`, deletedBy})
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error : error.message})
    }
}