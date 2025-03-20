const insuranceClaimsRoutes = require('../controllers/insuranceClaimsController')
const express = require('express')

const router = express.Router()

// GET ALL INSURANCE CLAIMS
router.get('/claims-history', insuranceClaimsRoutes.getInsuranceHistory)

// ADD NEW CLAIMS
router.post('/add-claims', insuranceClaimsRoutes.addNewClaims)

module.exports = router