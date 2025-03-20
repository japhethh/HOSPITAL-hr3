const budgetController = require('../controllers/budgetController')
const express = require('express')

const router = express.Router()

// GET ALL REQUEST
router.get('/get-requests', budgetController.getRequests)

// ADD NEW REQUEST
router.post('/add-request', budgetController.addRequest)

// UPDATE BUDGET REQUEST
router.patch('/update-request/:id', budgetController.updateRequest)

module.exports = router