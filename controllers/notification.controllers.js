const User = require('../models/user.models')
const Group = require('../models/group.models')
const Entry = require('../models/entry.models')
const jwt = require('jsonwebtoken')
const bcrypt= require('bcrypt')

const fetchNotifications = async (req, res) =>{
    try{
        const {id} = req._id
        const notifications = await Notification.find({ recipientId: id })
            .sort({ createdAt: -1 }) 
            .populate('senderId', 'username') 
            
            res.json({
                status: 'SUCCESS',
                data: notifications
            })
    }catch(error){
        res.status(500).json({
            status: 'FAILED',
            message: 'nope.',
            error: error.message
        })

    }
}

module.exports = {fetchNotifications}