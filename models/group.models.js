const mongoose = require ('mongoose')
const User = require('./user.models')
const groupSchema = mongoose.Schema({
    name:  {
        type: String,
        required: true,
        minLength: 5
    },
    email: {
        type: String,
        required: true,
        minLength: 5,
    unique: true
},
<<<<<<< HEAD
announce:{
    type: String,
    default: ''
},
    password:{
        type: String,
        
        minLength: 7
    },
=======
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
    spots: Number,
    enrolled: {
        type: Number,
        default: 0},
    GroupImg: String,
<<<<<<< HEAD
    price: Number,
    firstTime: {
        type: Boolean,
        default: true
    }
=======
    price: Number
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
}, {toJSON: {virtuals: true}, toObject: {virtuals: true}})

groupSchema.virtual('members', {
    ref: 'User',
    localField: '_id',
    foreignField: 'group'
})

const Group = mongoose.model('Group', groupSchema)

module.exports = Group