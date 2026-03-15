const mongoose = require('mongoose')
const User = require('./user.models')
const Comment = require('./comment.models')

const entrySchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 5
    },
    content: {
        type: String,
        required: true,
        minLength: 50
    },
    entryImg:{
        type: String
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments:[
        {type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    likes:[
        {type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    public:{
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
})

const Entry = mongoose.model('Entry', entrySchema)

module.exports = Entry