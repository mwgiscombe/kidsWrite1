const User = require('../models/user.models')
const Group = require('../models/group.models')
const Entry = require('../models/entry.models')
const jwt = require('jsonwebtoken')
const bcrypt= require('bcrypt')

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
        // const finalUsers = formatted.map(user=>`Name: ${user.name} | userName: ${user.userName} | Group: ${user.group.name}| parentEmail: ${user.parentEmail} | Age: ${user.age} | Current Balance: ${user.balance} | ${user.entries.map(e=> e.title)}`)
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
        // const {id} = req._id
        const user = await User.findById(req._id).populate('group').populate({
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
        const userGroup = user.group
        res.send(`<h1>Welcome ${user.name}!</h1>
            <h4>Your Group: ${userGroup.name}</h4>
            ${userGroup.announce ? `Announcement: ${userGroup.announce}`  : ''}
            <h5>Current Balance: $${user.balance} Buckaroos</h5>
            Your Entries:${userEntries}
            `)

    } catch(error){
        res.status(500).json({
            status: 'FAILED',
            message: 'nope.',
            error: error.message
        })
    }
}


const createUser = async (req, res)=>{
    try{        
        const {name, userName, parentEmail, password, confirm, age, group, bio} = req.body
        if(password != confirm){
            return res.status(401).json({
                status: 'FAILED',
                message: 'Passwords do not match'
            })
        }
        const encryptedPassword = await bcrypt.hash(password, 10)

        const userData = {
            name, 
            userName, 
            parentEmail, 
            password: encryptedPassword,
            age, 
            bio, 
            group
        }
        
        if (req.file) {
            userData.profileImg = `/uploads/users/${req.file.filename}`
        }

     
        const enrolledGroup = await Group.findById(group)
        if(group){
            
            if(enrolledGroup.enrolled >= enrolledGroup.spots){
                return res.status(401).json({
                    status: 'FAILED',
                    message: 'Sorry, this group is full'
                })
            }
        }
        
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


const updateUser = async (req, res) =>{
    try{
        const {id} = req.params
        const {name, parentEmail, age} = req.body
        await User.findByIdAndUpdate(id, {name, parentEmail, age})
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

    const doesPwdMatch = await bcrypt.compare(password, user.password)
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
        message: 'You are logged in'
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
    searchUsers,
    userDashboard,
    createUser,
    updateUser,
    loginUser,
    logoutUser,
    forgotPassword,
    deleteUser,
    deleteAllUsers
}