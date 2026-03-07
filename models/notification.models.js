const mongoose = require ('mongoose')
const User = require('./user.models')
const Group = require('./group.models')

const notificationSchema = mongoose.Schema({
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    },
    entryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entry'
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Notification = mongoose.model('Notification', notificationSchema)
module.exports = Notification