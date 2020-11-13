var express=require('express')
var router=express.Router()


var controller=require('./users.controller.js')

router.post('/',controller.create)
router.post('/login',controller.Login)
router.get('/audit',controller.getUsers)


module.exports = router;