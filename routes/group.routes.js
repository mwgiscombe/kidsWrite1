const express=require('express')
const router = express.Router()
const upload = require('../middlewares/upload')
const {isAuthenticated,isGroupAuthenticated, isGroupOwner} = require('../middlewares/auth.middlewares')

const {
    fetchGroups,
    searchGroups,
    groupDashboard,
    createGroup,
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
router.delete('/all', deleteAllGroups)

module.exports = router