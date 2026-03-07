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
announce:{
    type: String,
    default: ''
},
    password:{
        type: String,
        
        minLength: 7
    },
    spots: Number,
    enrolled: {
        type: Number,
        default: 0},
    GroupImg: String,
    price: Number
}, {toJSON: {virtuals: true}, toObject: {virtuals: true}})

groupSchema.virtual('members', {
    ref: 'User',
    localField: '_id',
    foreignField: 'group'
})

const Group = mongoose.model('Group', groupSchema)

module.exports = Group