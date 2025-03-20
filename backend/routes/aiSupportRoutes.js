const aiSupportController = require('../controllers/aiSupportController')
const express = require('express')

const router = express.Router()

router.post('/prompt-ai', aiSupportController.promptToAi)

module.exports = router