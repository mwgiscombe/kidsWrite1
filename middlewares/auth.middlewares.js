const jwt = require('jsonwebtoken')
const Entry = require('../models/entry.models')
const Comment =require('../models/comment.models')
const User = require('../models/user.models')
const Group = require('../models/group.models')

const isAuthenticated = (req, res, next) => {
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({
            status: 'FAILED',
            message: 'Please login first.'
        })
    }

    try{
        const {_id} = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req._id = _id
        next()
    }catch(error){ 
        return res.status(401).json({
            status: 'FAILED',
            message: 'Please login'
        })

    }
}

const isGroupAuthenticated = (req, res, next) => {
    const token = req.cookies.groupToken
    if(!token){
        return res.status(401).json({
            status: 'FAILED',
            message: 'Please login your group first.'
        })
    }

    try{
        const {_id} = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req._id = _id
        next()
    }catch(error){ 
        return res.status(401).json({
            status: 'FAILED',
            message: 'Please login your group'
        })

    }
}

const isProfileOwner = (req, res, next) => {
    const currentUserId = req._id
    if(currentUserId != req.params.id){
        return res.status(403).json({
            status: 'FAILED',
            message: 'You are not the owner of this profile'
        })
    }
    next()
}

const isGroupOwner = (req, res, next) => {
    const token = req.cookies.groupToken
    console.log(token)
    const {_id} = jwt.verify(token, process.env.JWT_SECRET_KEY)
    if(_id != req.params.id){
        return res.status(403).json({
            status: 'FAILED',
            message: 'You are not the owner of this group'
        })
    }
    next()
}

const isEntryAuthor = async (req, res, next) =>{
   try{ const currentUserId = req._id
    const entryID= req.params.id

    const entry = await Entry.findById(entryID)
    if(!entry){
        return res.status(400).send('Entry does not seem to exist')
    }

    if(currentUserId != entry.author){
        return res.status(403).send('You are not the owner of this entry')
    }
    next()}catch(error){
        return res.status(500).send('something went wrong')
    }

}

const isCommentAuthor = async (req, res, next) =>{
    try{ 
        const currentUserId = req._id
        const commentId= req.params.id
 
     const comment = await Comment.findById(commentId)
     if(!comment){
         return res.status(400).send('comment does not seem to exist')
     }
 
     if(currentUserId != comment.author){
         return res.status(403).send('You are not the owner of this comment')
     }
     next()}catch(error){
         return res.status(500).send('something went wrong')
     }
 
 }

 const isCommentOrEntryAuthor = async (req, res, next) =>{
    try{ 
        const currentUserId = req._id
        const commentId= req.params.id
 
     const comment = await Comment.findById(commentId).populate('entry')
     if(!comment){
         return res.status(400).send('comment does not seem to exist')
     }
 
     if(currentUserId == comment.author || currentUserId == comment.entry.author){
         next()
     }else{
        return res.status(403).send('You are not the owner of this comment or entry')
     }
    }catch(error){
         return res.status(500).send('something went wrong')
     }
 
 }
module.exports= {isAuthenticated, isGroupAuthenticated, isProfileOwner, isGroupOwner, isEntryAuthor, isCommentAuthor, isCommentOrEntryAuthor}