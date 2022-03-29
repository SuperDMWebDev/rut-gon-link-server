const router = require('express').Router()

const authController = require('../controllers/AuthController')
const verifyToken = require('../util/verifyToken')

router.post('/register', authController.register)

router.post('/login', authController.login)
router.put('/password', verifyToken.verify, authController.changePassword)

module.exports = router