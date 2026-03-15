const express=require('express')
const router = express.Router()
const upload = require('../middlewares/upload')
<<<<<<< HEAD
const {isAuthenticated,isGroupAuthenticated, isGroupOwner} = require('../middlewares/auth.middlewares')
=======
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2

const {
    fetchGroups,
    searchGroups,
    groupDashboard,
    createGroup,
<<<<<<< HEAD
    loginGroup,
    groupMessage,
    logoutGroup,
    updateGroup,
    deleteGroup,
    deleteAllGroups,
    getCurrentGroup
} = require('../controllers/group.controllers')

router.get('/', fetchGroups)
router.post('/login', loginGroup)
router.post('/logout', isGroupAuthenticated, logoutGroup)
router.post('/message', isGroupAuthenticated, groupMessage)
router.get('/current-group', isGroupAuthenticated, getCurrentGroup)
router.get('/search', searchGroups)
router.get('/dashboard', isGroupAuthenticated, groupDashboard)
router.post('/', upload.single('GroupImg'), createGroup)
router.patch('/:id', isGroupOwner, updateGroup)
router.delete('/:id', isGroupOwner, deleteGroup)
=======
    updateGroup,
    deleteGroup,
    deleteAllGroups
} = require('../controllers/group.controllers')

router.get('/', fetchGroups)
router.get('/search', searchGroups)
router.get('/:id/dashboard', groupDashboard)
router.post('/', upload.single('GroupImg'), createGroup)
router.patch('/:id', updateGroup)
router.delete('/:id', deleteGroup)
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
router.delete('/all', deleteAllGroups)

module.exports = router