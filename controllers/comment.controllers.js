const Entry = require('../models/entry.models')
const User = require('../models/user.models')
const Comment = require('../models/comment.models')

const fetchComments = async (req, res) =>{
    try{
        const {entry} = req.params
        const comments = await Comment.find({entry}).populate({
            path: 'likes',
            select: 'userName'
        })
       
        res.json({
            status: 'SUCCESS',
            data: comments
        })

    }catch(error){
        res.status(500).json({
            status: 'FAILED',
            message: 'Can not fetch entries'
        })
    }
}


const createComment = async (req, res) =>{
    try{
        const {id} = req.params
        const {content, authorId} = req.body
        
        const author = await User.findById(authorId)
        const entry = await Entry.findById(id)

        if(!entry){
            return res.status(400).json({
                status: 'FAILED',
                message: 'Entry not found'
            })
        }
        if(!author){
            return res.status(400).json({
                status: 'FAILED',
                message: 'No matching user'
            })
        }
       const newComment = await Comment.create({entry: entry._id, content, author: author._id})
       await User.findByIdAndUpdate(authorId,
        {$inc: {balance: .5}},
        {new: true}
       )
       entry.comments.push(newComment._id)
        await entry.save()
        res.json({
            status: 'SUCCESS',
            message: 'Comment has been created! You earned half a buckaroo!'
        })
    }catch(error){
        res.status(500).json({
            status: 'FAILED',
            message: 'Can not create comment',
            error: error.message
        })
    }
}

const updateComment = async (req, res) =>{
    try{
        const {id} = req.params
        const {title, content} =  req.body
        
        await Entry.findByIdAndUpdate(id, {title, content})
        res.json({
            status: 'SUCCESS',
            message: 'Entry has been updated!'
        })
    }catch(error){
        res.status(500).json({
            status: 'FAILED',
            message: 'Can not update entry', error
        })
    }
}

const deleteComment = async (req, res) =>{
    try{
        const {id} = req.params
        
        
        await Comment.findByIdAndDelete(id)
        res.json({
            status: 'SUCCESS',
            message: 'Comment has been deleted!'
        })
    }catch(error){
        res.status(500).json({
            status: 'FAILED',
            message: 'Can not delete entry', error
        })
    }
}
const deleteAllCommentsForEntry = async (req, res) =>{
    try{
        const {entry} = req.params
        
        const currentEntry = await Entry.findById(entry)
        const entryName = currentEntry.title
        await Comment.find({entry}).deleteMany()
        res.json({
            status: 'SUCCESS',
            message: `All comments have been deleted from ${entryName}`
        })
    }catch(error){
        res.status(500).json({
            status: 'FAILED',
            message: 'Can not delete entry', error
        })
    }
}

const toggleLikeComment = async (req, res) =>{
  try{
    const  {id} = req.params
    const currentUser = req.body.currentUser
    
  const comment = await Comment.findById(id)
  const user = await User.findById(currentUser)

  if(!comment){
    return res.status(400).json({
        status: 'FAILED',
        message: 'No entry found'
    })
  }

  if(!user){
    return res.status(400).json({
        status: 'FAILED',
        message: 'User not found yo.'
    })
  }

  const alreadyLiked = comment.likes.some(id => id.toString() == user._id.toString())
  if(alreadyLiked){
    comment.likes = comment.likes.filter(id => id.toString() != user._id.toString())
  }else{
    comment.likes.push(user._id)
  }
  await comment.save()

  res.json({
    status: 'SUCCESS',
    message: `Comment ${alreadyLiked ? 'unliked': 'liked'} successfully!`
  })}catch(error){
    res.status(500).json({
        status: 'FAILED', 
        message: 'something went terribly wrong',
        error: error.message
    })
  }

}

module.exports={fetchComments, createComment, updateComment, deleteComment, deleteAllCommentsForEntry, toggleLikeComment}
