const express = require('express')
const router = express()

const {createBudget, getAllBudgets, 
       getSingleBudget, updateBudget,
       deleteBudget, setOwnerId} = require('../controllers/budget')

const {protect} = require('../controllers/auth')

router.route('/budget')
    .post(protect, setOwnerId ,createBudget)
    .get(getAllBudgets)

router.route('/budget/:id')
    .get(getSingleBudget)
    .patch(protect, setOwnerId, updateBudget)
    .delete(protect, setOwnerId ,deleteBudget)

module.exports = router