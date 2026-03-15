const mongoose = require('mongoose')
const Group = require('./group.models')
const Entry = require('./entry.models')
const avatarRando = Math.floor(Math.random() * 22) + 1;
const userSchema = mongoose.Schema({
    name:  {
        type: String,
        required: true,
        minLength: 2
    },
    userName:{
        type: String,
        required: true,
        minLength:3,
        unique: true
    },
    parentEmail: {
        type: String,
        
        
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
        type: String,
        default: `/src/assets/avatars/avatar%20(${avatarRando}).png`
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