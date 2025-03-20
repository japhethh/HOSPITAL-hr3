const billingController = require('../controllers/billingController');
const express = require('express');

const router = express.Router();

// GET ALL BILLING RECORDS
router.get('/get-billings', billingController.getBilling);

// ADD NEW BILLING RECORD
router.post('/new-billing', billingController.newBilling);

// UPDATE BILLING
router.patch('/update-billing/:id', billingController.updateBilling);

module.exports = router;