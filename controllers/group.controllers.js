const Group = require('../models/group.models')
const User = require('../models/user.models')

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
        const {id} = req.params
        const group = await Group.findById(id).populate({
            path: 'members',
            populate:{
                path: 'entries',
                select: '_id'
            }
          
        })
        const groupMembers = group.members.map(member=>`<li>Member Name: ${member.name}: <ul><li>Username: ${member.userName}</li><li>Age: ${member.age}</li><li>Current Balance: $${member.balance} Buckaroos</li><li>Number of posts: ${member.entries.length}</li></ul></li>`)
        
        res.send(`<h1>Welcome ${group.name}!</h1>
            <h4>Your group has ${group.enrolled} members</h4>
            Members:${groupMembers}
            `)

    } catch(error){
        res.status(500).json({
            status: 'FAILED',
            message: 'nope.',
            error: error.message
        })
    }
}

const createGroup = async (req, res)=>{
    try{
        const {name, email, spots}= req.body
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
        await Group.create({name, email, spots, price})
   
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
   
    const defaultGroup = await Group.findOne({name: 'Default Group'})
    if(!defaultGroup){
        await Group.create({name:'Default Group', email:'No Email Needed', spots: 9999999, enrolled: 0})
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
     await Group.create({name:'Default Group', email:'No Email Needed'})
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
    createGroup,
    updateGroup,
    deleteGroup,
    deleteAllGroups
}