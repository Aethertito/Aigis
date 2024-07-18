const express = require('express')
const router = express.Router()
const MembershipController = require('../controllers/membership.js')

router.get('/', MembershipController.getMembership)

module.exports = router