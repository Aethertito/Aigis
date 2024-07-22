const express = require('express')
const router = express.Router()
const PackageController = require('../controllers/packages.js')

router.get('/', PackageController.getPackage)

module.exports = router