const mongoose = require('mongoose')
const Group = require('./group.models')
const Entry = require('./entry.models')

const userSchema = mongoose.Schema({
    name:  {
        type: String,
        required: true,
        minLength: 5
    },
    userName:{
        type: String,
        required: true,
        minLength: 5,
        unique: true
    },
    parentEmail: {
        type: String,
        required: true,
        
    },
    age: { 
        type: Number,
        required: true,
       },
    password:{
        type: String,
        required: true
    },
    balance:{
        type: Number,
        default: 0
    },
    group:{
        type: mongoose.Schema.Types.ObjectId,
        ref: Group
        
    },
    bio:{
        type: String,
        minLength: 20
    },
    profileImg:{
        type: String
    }
},
    {
        timestamps: true,
    toJSON: {virtuals: true}, toObject: {virtuals: true}})

userSchema.virtual('entries', {
    ref: 'Entry',
    localField: '_id',
    foreignField: 'author'
})

const User = mongoose.model('User', userSchema )

module.exports= User