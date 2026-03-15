const Entry = require('../models/entry.models')
const User = require('../models/user.models')
const Comment = require('../models/comment.models')
<<<<<<< HEAD
const Notification = require('../models/notification.models')
const Group = require('../models/group.models')
=======
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2

const fetchEntries = async (req, res) =>{
    try{
        
<<<<<<< HEAD
        const entries = await Entry.find()
  .populate({
    path: 'author',
    select: '_id name userName'
  })
  .populate({
    path: 'likes',
    select: 'name userName'
  })
  .populate({
    path: 'comments',
    populate: {
      path: 'author',
      select: 'userName profileImg'
    }
  });
=======
        const entries = await Entry.find().populate('author', 'name userName').populate('likes', 'name userName').populate({
            path: 'comments',
            select: 'content author createdAt',
            populate:{
                path: 'author',
                select: 'name userName', 
                 
            },
            populate:{
                path: 'likes',
                select: 'name userName'
            }
            
        })
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
        res.json({
            status: 'SUCCESS',
            data: entries
        })

    }catch(error){
        res.status(500).json({
            status: 'FAILED',
            message: 'Can not fetch entries'
        })
    }
}
const searchEntries = async (req, res) =>{
    try{
        const {search} = req.body
        const {author} =req.query
        searchTerm ={}
        if(author){
            searchTerm.author={$regex: author, $options: 'i'}
        }
        if(search){
            searchTerm.$or=[
             {title: {$regex: search, $options: 'i'}},
             {content: {$regex: search, $options: 'i' }}
            ]
        }
        const entries = await Entry.find(searchTerm).populate('author', 'name userName').populate('likes', 'name userName')
        res.json({
            status: 'SUCCESS',
            data: entries
        })

    }catch(error){
        res.status(500).json({
            status: 'FAILED',
            message: 'Can not fetch entries'
        })
    }
}

const createEntry = async (req, res) =>{
    try{
<<<<<<< HEAD
        const {title, content, public} = req.body
        const author = req._id
        const user = await User.findById(author)
        
=======
        const {title, content, author} = req.body
        const user = await User.findById(author)
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
        if(!user){
            return res.status(400).json({
                status: 'FAILED',
                message: 'User not found'
            })
        }
<<<<<<< HEAD
        await Entry.create({title, content, author, public})
       const updatedUser = await User.findByIdAndUpdate(author,
        {$inc: {balance: 7}},
    {new: true})

    
    const groupMembers = await User.find({ 
        group: user.group, 
        _id: { $ne: author } 
      }).select('_id') 
    
      const notifications = groupMembers.map(member => ({
        recipientId: member._id,
        senderId: author,
        type: "new_entry",
        groupId: user.group,
        read: false
      }))
      
      await Notification.insertMany(notifications)
      
=======
        await Entry.create({title, content, author})
       const updatedUser = await User.findByIdAndUpdate(author,
        {$inc: {balance: 7}},
    {new: true})
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
        res.json({
            status: 'SUCCESS',
            message: 'Entry has been created! You earned 7 Buckaroos!',
            
        })
    }catch(error){
        res.status(500).json({
            status: 'FAILED',
            message: 'Can not create entry',
            error: error.message
        })
    }
}

const updateEntry = async (req, res) =>{
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

const deleteEntry = async (req, res) =>{
    try{
        const {id} = req.params
<<<<<<< HEAD
      
        
=======
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
        
        
        await Entry.findByIdAndDelete(id)
        res.json({
            status: 'SUCCESS',
            message: 'Entry has been deleted!'
        })
    }catch(error){
        res.status(500).json({
            status: 'FAILED',
            message: 'Can not delete entry', error
        })
    }
}

const toggleLikeEntry = async (req, res) =>{
  try{
    const  {id} = req.params
<<<<<<< HEAD
    const currentUser = req._id
=======
    const currentUser = req.body.currentUser
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
    
  const entry = await Entry.findById(id)
  const user = await User.findById(currentUser)

  if(!entry){
    return res.status(400).json({
        status: 'FAILED',
        message: 'No entry found'
    })
  }

  const alreadyLiked = entry.likes.some(id => id.toString() == user._id.toString())
  if(alreadyLiked){
    entry.likes = entry.likes.filter(id => id.toString() != user._id.toString())
  }else{
    entry.likes.push(user._id)
  }
  await entry.save()

  res.json({
    status: 'SUCCESS',
    message: `Post ${alreadyLiked ? 'unliked': 'liked'} successfully!`
  })}catch(error){
    res.status(500).json({
        status: 'FAILED', 
        message: 'something went terribly wrong',
        error: error.message
    })
  }

}

module.exports={fetchEntries, searchEntries, createEntry, updateEntry, deleteEntry, toggleLikeEntry}
