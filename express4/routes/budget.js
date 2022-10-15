const express = require('express')
const router = express.Router()

const {createBudget, getSingleBudget, getAllBudgets, updateBudget, deleteBudget} = require('../controllers/budget')

router.route('/budget').post(createBudget).get(getAllBudgets)
router.route('/budget/:id').get(getSingleBudget).patch(updateBudget).delete(deleteBudget)

module.exports = router