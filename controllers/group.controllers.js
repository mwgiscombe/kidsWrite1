const Group = require('../models/group.models')
const User = require('../models/user.models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const fetchGroups = async (req, res) =>{
    try{
        const groups = await Group.find().populate('members')
        groups.forEach((g)=>{console.log(g.members.length)})
        res.json({
            status: 'SUCCESS',
            data: groups
        })

    } catch(error){
        res.status(500).json({
            status: 'FAILED',
            message: 'nope.'
        })
    }
}

const searchGroups = async (req, res) =>{
    try{
        const {search, email} = req.body
        searchTerm = {}
        if(search){
            searchTerm.name= {$regex: search, $options: 'i'}
        }
        if(email){
            searchTerm.email= {$regex: email, $options: 'i'}
        }

        const groups = await Group.find(searchTerm).populate('members')
      
        res.json({
            status: 'SUCCESS',
            data: groups
        })

    } catch(error){
        res.status(500).json({
            status: 'FAILED',
            message: 'nope.'
        })
    }
}

const groupDashboard = async (req, res) =>{
    try{
         
          
            
        const group = await Group.findById(req._id).populate({
            path: 'members',
            populate:{
                path: 'entries',
                select: '_id'
            }
          
        })

        if(!group){
            return res.status(404).json({
                status: 'failed',
                message: 'group not found'
            })
        }
        const groupMembers = group.members.map(member=>`<li>Member Name: ${member.name}: <ul><li>Username: ${member.userName}</li><li>Age: ${member.age}</li><li>Current Balance: $${member.balance} Buckaroos</li><li>Number of posts: ${member.entries.length}</li></ul></li>`)
        
        res.send(`<h1>Welcome ${group.name}!</h1>
            <h4>Your group has ${group.enrolled} members</h4>
            Members:${groupMembers}
            `)

    } catch(error){
        res.status(500).json({
            status: 'FAILED',
            message: 'nope.',
           
        })
    }
}

const createGroup = async (req, res)=>{
    try{
        const {name, email, password, confirm, spots}= req.body
        function calculatePrice(spots){
            let pricePer = 0
            if(spots<10){
                pricePer = 25
                return pricePer * spots
            }
            if(spots >= 10 && spots < 20){
                pricePer = 22
                return pricePer * spots
            }
            if(spots >= 20 && spots < 35){
                pricePer = 20
                return pricePer * spots
            }
            if(spots >= 35){
                pricePer = 15
                return pricePer * spots
            }

        }
        const price = calculatePrice(spots)
        if(confirm != password){
            return res.status(401).json({
                status: 'FAILED',
                message: 'Passwords do not match'
            })
        }
        const encryptedPassword = await bcrypt.hash(password, 10)
        await Group.create({name, email, spots, password: encryptedPassword, price})
   
        res.json({
            status: 'SUCCESS!',
            message: 'Group Created!',
            Cost: '$' + price
        })

    }catch(error){
        res.status(500).json({
            status: 'FAILED',
            message: 'Something went terribly wrong.',
            error: error.message
        })
    }
}

const loginGroup = async (req, res)=>{
    const {email, password} = req.body
    const group = await Group.findOne({email})
    if(!group){
        return res.status(404).json({
            status: 'failed',
            message: 'No matching group found'
        })
    }

    const doesPwdMatch = await bcrypt.compare(password, group.password)
    if(!doesPwdMatch){
        return res.status(401).json({
            status: 'FAILED',
            message: 'invalid creds'
        })
    }

    const {_id, name, spots}=group
    const token = jwt.sign({_id}, process.env.JWT_SECRET_KEY, {expiresIn: 60*60})
    res.cookie('groupToken', token, {
        httpOnly: true,
        maxAge: 60*60*1000})

    return res.json({
        status: 'SUCCESS',
        message: `${group.name} is logged in`,
        group:{_id,name, spots, email}
    })
}

const groupMessage = async (req, res)=>{
    const {content} = req.body
    const group = await Group.findById(req._id)
    if(!group){
        return res.status(404).json({
            status: 'failed',
            message: 'No matching group found'
        })
    }

   if(!content){
    return res.status(401).json({
        status: 'FAILED',
        message: 'please enter a message'
    })
   }

   group.announce = content
await group.save()
    return res.json({
        status: 'SUCCESS',
        message: `Your message has been sent!`,
        
    })
    
}
const logoutGroup = async (req, res) =>{
    try{
        res.clearCookie('groupToken')
        res.json({
            status: 'SUCCESS',
            message: 'Group logged out succesfully mofo.'
        })

    }catch(error){
        res.status(500).json({
            status: 'FAILED',
            message: 'Server error. You are stuck here forever.'
        })
        
    }
}

const getCurrentGroup = async (req, res) =>{
  try{  
    
    const group = await Group.findById(req._id)
    if(!group){
        return res.status(404).json({
            status: 'failed',
            message: 'no group found'
        })
    }

    res.json({
        status: 'SUCCESS',
        group
    })}catch(error){
        return res.status(500).json({
        status: 'failed',
        message: 'something went wrong'
    })
    }
}

const updateGroup = async (req, res) =>{
    try{
        const {id} = req.params
        const {name} = req.body
        await Group.findByIdAndUpdate(id, {name})
        res.json({
            status: 'SUCCESS',
            message: 'Group has been updated!'
        })

    }catch(error){
        res.status(500).json({
            status: 'FAILED',
            message: 'I cannot update!'
        })
    }
}

const deleteGroup = async (req, res) => {
   try{ 
    const {id} = req.params
    const groupToDelete = await Group.findById(id)
    if(!groupToDelete){
        return res.status(500).json({
            status: 'FAILED',
            message: 'Group Not Found'

        })
    }
   
    let defaultGroup = await Group.findOne({name: 'Default Group'})
    if(!defaultGroup){
        const newpwd= await bcrypt.hash('default123', 10)
        defaultGroup = await Group.create({name:'Default Group', email:'No Email Needed', password: newpwd, spots: 9999999, enrolled: 0})
    }

    const usersToMove = await User.updateMany(
        {group: id},
        {group:defaultGroup._id}
    )

    const numberMoved = usersToMove.modifiedCount || 0
    defaultGroup.enrolled += numberMoved
    await defaultGroup.save()




    await Group.findByIdAndDelete(id)
    res.json({
        status: 'SUCCESS',
        message: `Group deleted. ${numberMoved} users moved to Default Group`
    })
    }catch(error){
        res.status(500).json({
        status: 'FAILED',
        message: 'They will not go away!',
        error: error.message
    })
    }
}

const deleteAllGroups = async (req, res) => {
    try{ 
     
     await Group.deleteMany()
     await Group.create({name:'Default Group', password: 'default123', email:'No Email Needed'})
     res.json({
         status: 'SUCCESS',
         message: 'Groups deleted. Default Group Created'
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
    fetchGroups,
    searchGroups,
    groupDashboard,
    groupMessage,
    createGroup,
    loginGroup,
    logoutGroup,
    getCurrentGroup,
    updateGroup,
    deleteGroup,
    deleteAllGroups
}