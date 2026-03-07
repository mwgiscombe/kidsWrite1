const express=require('express')
const router = express.Router()
const Notification = require('../models/notification.models')
const {isAuthenticated} = require('../middlewares/auth.middlewares')


const {
    fetchNotifications
} = require('../controllers/notification.controllers')

router.get('/', fetchNotifications)

module.exports = router