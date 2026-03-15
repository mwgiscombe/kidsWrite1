const express= require('express')
const router = express.Router()
const upload = require('../middlewares/upload')
const { isAuthenticated, isProfileOwner, isEntryAuthor, isGroupAuthenticated, isGroupOwner } = require('../middlewares/auth.middlewares')

const {
    loginUser,
    logoutUser,
    forgotPassword,
    fetchUsers,
    fetchUser,
    searchUsers,
    userDashboard,
    UserPublicProfile,
    getCurrentUser,
    createUser,
    updateUser,
    updateGroupUser,
    deleteUser,
    deleteAllUsers

} = require('../controllers/user.controllers')
const { deleteGroup } = require('../controllers/group.controllers')


router.get('/', fetchUsers)
router.get('/current',isAuthenticated, getCurrentUser)
router.get('/userProfile/:id', isGroupAuthenticated, UserPublicProfile)
router.get('/:id',  fetchUser)


router.post('/login', loginUser)
router.post('/logout', isAuthenticated, logoutUser)
router.patch('/forgot', isAuthenticated, forgotPassword)
router.get('/search', searchUsers)
router.get('/dashboard', isAuthenticated, userDashboard)



router.post('/', createUser)
router.patch('/:id', isAuthenticated, isProfileOwner, updateUser)
router.patch('/:id/editMember', isGroupAuthenticated, isGroupOwner, updateGroupUser)
router.delete('/all', isAuthenticated, deleteAllUsers)
router.delete('/:id',isGroupAuthenticated, isGroupOwner, deleteUser)
router.delete('/:id/deleteGroup', isGroupAuthenticated, isGroupOwner, deleteGroup)


module.exports = router
