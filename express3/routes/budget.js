const routeMiddleware = require('../middleware/router')

const {createBudget, getSingleBudget, getAllBudgets, updateBudget, deleteBudget} = require('../controllers/budget')

routeMiddleware.route('/budget').post(createBudget).get(getAllBudgets)
routeMiddleware.route('/budget/:id').get(getSingleBudget).patch(updateBudget).delete(deleteBudget)

module.exports = routeMiddleware