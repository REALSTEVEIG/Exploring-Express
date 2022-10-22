const express = require('express')
const router = express.Router()

const {createBudget, 
    getSingleBudget, 
    getAllbudgets, 
    updateBudget, 
    deleteBudget} 
    
= require('../controllers/budget')

router.route('/budget').post(createBudget).get(getAllbudgets)
router.route('/budget/:id').get(getSingleBudget).patch(updateBudget).delete(deleteBudget)

module.exports = router
