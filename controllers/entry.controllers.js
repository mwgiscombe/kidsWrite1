const Entry = require('../models/entry.models')
const User = require('../models/user.models')
const Comment = require('../models/comment.models')

const fetchEntries = async (req, res) =>{
    try{
        
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
        const {title, content} = req.body
        const author = req._id
        const user = await User.findById(author)
        if(!user){
            return res.status(400).json({
                status: 'FAILED',
                message: 'User not found'
            })
        }
        await Entry.create({title, content, author})
       const updatedUser = await User.findByIdAndUpdate(author,
        {$inc: {balance: 7}},
    {new: true})
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
    const currentUser = req._id
    
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
