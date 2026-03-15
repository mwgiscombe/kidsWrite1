const mongoose = require('mongoose')
const Group = require('./group.models')
const Entry = require('./entry.models')
<<<<<<< HEAD
const avatarRando = Math.floor(Math.random() * 22) + 1;
=======

>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
const userSchema = mongoose.Schema({
    name:  {
        type: String,
        required: true,
<<<<<<< HEAD
        minLength: 2
=======
        minLength: 5
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
    },
    userName:{
        type: String,
        required: true,
<<<<<<< HEAD
        minLength:3,
=======
        minLength: 5,
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
        unique: true
    },
    parentEmail: {
        type: String,
<<<<<<< HEAD
        
=======
        required: true,
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
        
    },
    age: { 
        type: Number,
        required: true,
       },
<<<<<<< HEAD
    password:{
        type: String,
        required: true
    },
=======
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
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
<<<<<<< HEAD
        type: String,
        default: `/src/assets/avatars/avatar%20(${avatarRando}).png`
=======
        type: String
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
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