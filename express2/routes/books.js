const express = require('express')
const router = express.Router()

const {createBook, getSingleBook, getAllBooks, updateBook, deleteBook} = require('../controllers/books')

router.route('/book').post(createBook).get(getAllBooks)
router.route('/book/:id').get(getSingleBook).patch(updateBook).delete(deleteBook)

module.exports = router