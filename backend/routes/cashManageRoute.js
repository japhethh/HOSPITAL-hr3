const cashManageController = require('../controllers/cashManageController')
const express = require('express')

const router = express.Router()

// GET TOTAL CASH
router.get('/get-total-cash', cashManageController.getTotalCash)

// GET ALLOCATION
router.get('/get-allocations', cashManageController.getAllocations)

// GET BUDGET HISTORY
router.get('/get-budget-history', cashManageController.getBudgetHistory)

// ADD NEW ALLOCATION
router.post('/add-allocation', cashManageController.addBudgetAllocation)

module.exports = router