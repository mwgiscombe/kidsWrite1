const mongoose = require('mongoose')
const User = require('./user.models')
const Entry = require('./entry.models')

const commentSchema = mongoose.Schema({
    entry:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Entry',
        required: true
    },
       content: {
        type: String,
        required: true,
        minLength: 5
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likes:[
        {type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
},
{
    timestamps: true
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment