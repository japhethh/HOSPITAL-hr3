const financialReportController = require('../controllers/financialReportController')
const express = require('express')

const router = express.Router()

router.get('/get-financial-reports', financialReportController.getFinancialReports)

router.post('/add-financial-reports', financialReportController.addNewFinancialReport)

module.exports = router