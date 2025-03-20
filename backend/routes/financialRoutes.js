const financialController = require('../controllers/financialController')
const express = require('express')

const router = express.Router()

// GET CHART OF ACCOUNTS
router.get('/chart-of-accounts', financialController.chartOfAccounts)

// GET ANALYTICS
router.get('/analytics', financialController.analytics)

module.exports = router