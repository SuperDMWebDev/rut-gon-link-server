const router = require('express').Router()

const linkController = require('../controllers/LinkController')
const verifyToken = require('../util/verifyToken')
// gui link de short
router.post('/short', linkController.shortLink)
//
router.delete('/:id', verifyToken.verify, linkController.delLink)
router.get("/list", verifyToken.verify, linkController.getLink)
router.get('/:url', linkController.accessShortUrl)

module.exports = router