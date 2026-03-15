const User = require('../models/user.models')
const Group = require('../models/group.models')
<<<<<<< HEAD
const Notification= require('../models/notification.models')
const Entry = require('../models/entry.models')
const jwt = require('jsonwebtoken')
const bcrypt= require('bcrypt')
=======
const Entry = require('../models/entry.models')
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2

const fetchUsers = async (req, res) =>{
    try{
        const users = await User.find().populate('group', 'name')
        .populate({
          path: 'entries',
          select: 'title content comments likes',
          populate: [
            {path: 'comments',
                select: 'author content',
            populate:{path:'author',
                select: 'userName'
            }},
            {path: 'likes',
                select: 'userName',
                populate:{path:'userName'}

            }
          ]
        })
        const formatted = users.map(user => ({ ...user.toObject(), profileImg: process.env.BASE_URL  + user.profileImg }))
<<<<<<< HEAD
        // const finalUsers = formatted.map(user=>`Name: ${user.name} | userName: ${user.userName} | Group: ${user.group.name}| parentEmail: ${user.parentEmail} | Age: ${user.age} | Current Balance: ${user.balance} | ${user.entries.map(e=> e.title)}`)
=======
        const finalUsers = formatted.map(user=>`Name: ${user.name} | userName: ${user.userName} | Group: ${user.group.name}| parentEmail: ${user.parentEmail} | Age: ${user.age} | Current Balance: ${user.balance} | ${user.entries.map(e=> e.title)}`)
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
        res.json({
            status: 'SUCCESS',
            data: formatted
        })

    } catch(error){
        res.status(500).json({
            status: 'FAILED',
<<<<<<< HEAD
            message: 'nope.',
            error: error.message
=======
            message: 'nope.'
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
        })
    }
}

<<<<<<< HEAD
const fetchUser = async (req, res) =>{
    try{
const user = await User.findById(req.params.id).populate({
    path: 'entries',
    select: 'title content comments likes',
    populate: [
      {path: 'comments',
          select: 'author content',
      populate:{path:'author',
          select: 'userName profileImg'
      }},
      {path: 'likes',
          select: 'userName profileImg'

      }
    ]
  }).populate({
      path: "group",
      populate: {
        path: "members",
        model: "User"
      }
    })
  if(!user){
      return res.status(404).json({
          status: 'FAILED',
          message: 'User not found'
      })
  }
  res.json({
      status: 'SUCCESS',
      user
  })

}catch(error){
  return res.status(500).json({
      status: 'FAILED',
      message: 'Seomthing went wrong in the server'
  })
  
}
}

=======
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
const searchUsers = async (req, res) =>{
    try{
        const {search, parentEmail, group} = req.body
        searchTerm = {}
        if(search){
            searchTerm.$or=[
                    {name: {$regex: String(search), $options: 'i'}},
                    {userName: {$regex: String(search), $options: 'i'}}
                        ]
        }
        if(parentEmail){
            searchTerm.parentEmail = {$regex: String(parentEmail), $options: 'i'}
        }

        if(group){
            searchTerm.group = {$regex: String(group), $options: 'i'}
        }
        const users = await User.find(searchTerm).populate('group').populate('entries')
        
        
        const formatted = users.map(user => ({ ...user.toObject(), profileImg: process.env.BASE_URL  + user.profileImg }))
        res.json({
            status: 'SUCCESS',
            data: formatted
        })

    } catch(error){
        res.status(500).json({
            status: 'FAILED',
            message: 'nope.',
            error: error.message
        })
    }
}

const userDashboard = async (req, res) =>{
    try{
<<<<<<< HEAD
        // const {id} = req._id
        const user = await User.findById(req._id).populate('group').populate({
=======
        const {id} = req.params
        const user = await User.findById(id).populate('group').populate({
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
            path: 'entries',
            populate: [
                {
                    path: 'comments',
                    select: 'content author likes',
                    populate: [
                        { path: 'author', select: 'userName' },
                        { path: 'likes', select: 'userName' }
                    ]
                },
                {
                    path: 'likes',
                    select: 'userName'  // assuming likes are User refs
                }
            ]
        })
<<<<<<< HEAD
        const notifications = await Notification.find({ recipientId: req._id })
        .populate('senderId', 'userName')
=======
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
        const userEntries = user.entries.map(entry =>
            `<li>${entry.title}: 
                <ul>
                    <li>${entry.content.slice(0, 100)}...</li>
                    <li>👍 Liked by: ${entry.likes?.length > 0 ? entry.likes.map(like => like.userName).join(', ') : 'no likes'}</li>
                    <li>Comments:
                        <ul>${entry.comments.map(comment =>
                            `<li>${comment.content} - ${comment.author.userName} ${comment.likes?.length > 0 ? '👍 liked by: ' + comment.likes.map(like => like.userName).join(', ') : ''}</li>`
                        ).join('')}</ul>
                    </li>
                </ul>
            </li>`
        )
<<<<<<< HEAD
        const notificationList = notifications.length > 0
            ? notifications.map(n =>
                `<li>${n.senderId.userName} made a new entry</li>`
            ).join('')
            : '<li>No notifications</li>'
        const userGroup = user.group
       
        res.send(`<h1>Welcome ${user.name}!</h1>
            <h4>Your Group: ${userGroup.name}</h4>
            ${userGroup.announce ? `Announcement: ${userGroup.announce}`  : ''}
            <h5>Current Balance: $${user.balance} Buckaroos</h5>
           <h5>🔔 Notifications: </h5> 
           ${notificationList}
           <h4> Your Entries:</h4>
            ${userEntries}
=======
        const userGroup = user.group
        res.send(`<h1>Welcome ${user.name}!</h1>
            <h4>Your Group: ${userGroup.name}</h4>
            <h5>Current Balance: $${user.balance} Buckaroos</h5>
            Your Entries:${userEntries}
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
            `)

    } catch(error){
        res.status(500).json({
            status: 'FAILED',
            message: 'nope.',
            error: error.message
        })
    }
}

<<<<<<< HEAD
const UserPublicProfile = async (req, res) =>{
    try{
        const user = await User.findById(req.params.id).populate({
            path: 'entries',
            select: 'title content comments likes',
            populate: [
              {path: 'comments',
                  select: 'author content',
              populate:{path:'author',
                  select: 'userName'
              }},
              {path: 'likes',
                  select: 'userName',
                  populate:{path:'userName'}
  
              }
            ]
          }).populate({
              path: "group",
              populate: {
                path: "members",
                model: "User"
              }
            })
          if(!user){
              return res.status(404).json({
                  status: 'FAILED',
                  message: 'User not found'
              })
          }
          res.json({
              status: 'SUCCESS',
              user
          })
  
      }catch(error){
          return res.status(500).json({
              status: 'FAILED',
              message: 'Seomthing went wrong in the server'
          })
          
      }
}
const getCurrentUser = async(req, res) =>{
    try{
        const user = await User.findById(req._id).select('-password')
        .populate({
          path: 'entries',
          select: 'title content comments likes',
          populate: [
            {path: 'comments',
                select: 'author content',
            populate:{path:'author',
                select: 'userName'
            }},
            {path: 'likes',
                select: 'userName',
                populate:{path:'userName'}

            }
          ]
        }).populate({
            path: "group",
            populate: {
              path: "members",
              model: "User"
            }
          })
        if(!user){
            return res.status(404).json({
                status: 'FAILED',
                message: 'User not found'
            })
        }
        res.json({
            status: 'SUCCESS',
            user
        })

    }catch(error){
        return res.status(500).json({
            status: 'FAILED',
            message: 'Seomthing went wrong in the server'
        })
        
    }
}


const createUser = async (req, res)=>{
    try{        
        const {name, userName, parentEmail, password, confirm, age, group, bio} = req.body
        // if(password != confirm){
        //     return res.status(401).json({
        //         status: 'FAILED',
        //         message: 'Passwords do not match'
        //     })
        // }
        const encryptedPassword = await bcrypt.hash(password, 10)

=======
const createUser = async (req, res)=>{
    try{        
        const {name, userName, parentEmail, age, group, bio} = req.body
        
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
        const userData = {
            name, 
            userName, 
            parentEmail, 
<<<<<<< HEAD
            password: encryptedPassword,
=======
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
            age, 
            bio, 
            group
        }
        
        if (req.file) {
            userData.profileImg = `/uploads/users/${req.file.filename}`
        }
<<<<<<< HEAD

     
        const enrolledGroup = await Group.findById(group)
        if(!enrolledGroup){
            return res.status(404).json({
                status: 'FAILED',
                message: 'Group not found'
            })
        }

       if(enrolledGroup.enrolled >= enrolledGroup.spots){
    return res.status(401).json({
        status: 'FAILED',
        message: 'Sorry, this group is full'
    })
}
=======
        const enrolledGroup = await Group.findById(group)
        if(group){
            
            if(enrolledGroup.enrolled >= enrolledGroup.spots){
                return res.status(401).json({
                    status: 'FAILED',
                    message: 'Sorry, this group is full'
                })
            }
        }
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
        
        await User.create(userData)
        enrolledGroup.enrolled +=1
        await enrolledGroup.save()
   
        res.json({
            status: 'SUCCESS!',
            message: `user Created and enrolled in Group ${enrolledGroup.name}!`,
            
        })

    }catch(error){
        console.error('Error:', error)
        res.status(500).json({
            status: 'FAILED',
            message: 'Something went terribly wrong.',
            error: error.message
        })
    }
}

<<<<<<< HEAD

const updateUser = async (req, res) =>{
    try{
        const {id} = req.params
        const {name, parentEmail, age, bio, userName, profileImg} = req.body
        await User.findByIdAndUpdate(id, {name, parentEmail, age, bio, userName, profileImg})
=======
const updateUser = async (req, res) =>{
    try{
        const {id} = req.params
        const {name, parentEmail, age} = req.body
        await User.findByIdAndUpdate(id, {name, parentEmail, age})
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
        res.json({
            status: 'SUCCESS',
            message: 'User has been updated!'
        })

    }catch(error){
        res.status(500).json({
            status: 'FAILED',
            message: 'I cannot update!'
        })
    }
}

<<<<<<< HEAD
const updateGroupUser = async (req, res) =>{
    try{
        const {id} = req.params
        const {name, parentEmail, age, bio, userName, profileImg, password} = req.body
        const encryptedPassword = await bcrypt.hash(password, 10)
        await User.findByIdAndUpdate(id, {name, parentEmail, age, bio, userName, profileImg, password: encryptedPassword})
        res.json({
            status: 'SUCCESS',
            message: 'User has been updated!'
        })

    }catch(error){
        res.status(500).json({
            status: 'FAILED',
            message: 'I cannot update!'
        })
    }
}


const loginUser = async (req, res) =>{
    console.log("BODY:", req.body)
    const {userName, password} = req.body
    const user = await User.findOne({userName})
    if(!user){
        return res.status(401).json({
            status: 'FAILED',
            message: 'Invalid Creds'
        })
    }

    let doesPwdMatch = await bcrypt.compare(password, user.password)
    


    if(!doesPwdMatch){
        return res.status(401).json({
            status: 'FAILED',
            message: 'Invalid Credentials.'
        })
    }
    const {_id} = user
    const token = jwt.sign({_id}, process.env.JWT_SECRET_KEY, {expiresIn: 60*60})
    res.cookie ('token', token, {expiresIn: 60*60*1000})
    console.log(token)
    return res.json({
        status: 'SUCCESS',
        message: 'You are logged in',
        user
    })
}

const logoutUser = async (req, res) =>{
    try{
        res.clearCookie('token')
        res.json({
            status: 'SUCCESS',
            message: 'User logged out succesfully mofo.'
        })

    }catch(error){
        res.status(500).json({
            status: 'FAILED',
            message: 'Server error. You are stuck here forever.'
        })
        
    }
}

const forgotPassword = async (req, res) => {
    try{
        const {userName, newPassword} = req.body
        const user = await User.findOne({userName})
        const {id} = user

        if(!user){
            return res.status(401).json({
                status: 'FAILED',
                message: 'No Matching User Found'
            }
            )
        }

        const encryptedNewPassword = await bcrypt.hash(newPassword,10)
        await User.findByIdAndUpdate(id,{password: encryptedNewPassword})

        return res.json({
            status: 'SUCCESS',
            message: 'You have reset your password'
        })

    }catch(error){
        return res.status(500).json({
            status: 'FAILED',
            message: 'something went wrong'
        })

    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const group = await Group.findById(user.group)
        if (group.enrolled > 0) {
            group.enrolled -= 1
            await group.save()
        }

        await User.findByIdAndDelete(id)

        res.json({
            status: "SUCCESS",
            message: "User deleted"
        })
    } catch (error) {
        res.status(500).json({
            status: "FAILED",
            message: error.message
        })
=======
const deleteUser = async (req, res) => {
   try{ 
    const {id} = req.params
    const user = await User.findById(id)
    const enrolledGroup = await Group.findById(user.group)
    enrolledGroup.enrolled -= 1
    enrolledGroup.save()

    await Entry.deleteMany({author:user})
      
    await User.findByIdAndDelete(id)
    res.json({
        status: 'SUCCESS',
        message: 'User and user entries deleted'
    })
    }catch(error){
        res.status(500).json({
        status: 'FAILED',
        message: 'They will not go away!',
        error: error.message
    })
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
    }
}
const deleteAllUsers = async (req, res) => {
    try{ 
     
    await User.deleteMany({})
    await Group.updateMany({},{enrolled:0})
    await Entry.deleteMany({})
    
     res.json({
         status: 'SUCCESS',
         message: 'All users and entries deleted and all group enrollment set to 0'
     })
     }catch(error){
         res.status(500).json({
         status: 'FAILED',
         message: 'They will not go away!',
         error: error.message
     })
     }
 }

module.exports ={
    fetchUsers,
<<<<<<< HEAD
    fetchUser,
=======
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
    searchUsers,
    userDashboard,
    createUser,
    updateUser,
<<<<<<< HEAD
    updateGroupUser,
    getCurrentUser,
    UserPublicProfile,
    loginUser,
    logoutUser,
    forgotPassword,
=======
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
    deleteUser,
    deleteAllUsers
}