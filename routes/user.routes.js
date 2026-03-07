const express= require('express')
const router = express.Router()
const upload = require('../middlewares/upload')
const { isAuthenticated, isProfileOwner, isEntryAuthor } = require('../middlewares/auth.middlewares')

const {
    loginUser,
    logoutUser,
    forgotPassword,
    fetchUsers,
    searchUsers,
    userDashboard,
    getCurrentUser,
    createUser,
    updateUser,
    deleteUser,
    deleteAllUsers
} = require('../controllers/user.controllers')


router.get('/', fetchUsers)
router.post('/login', loginUser)
router.post('/logout', isAuthenticated, logoutUser)
router.patch('/forgot', isAuthenticated, forgotPassword)
router.get('/search', searchUsers)
router.get('/dashboard', isAuthenticated, userDashboard)

router.post('/', createUser)
router.patch('/:id', isAuthenticated, isProfileOwner, updateUser)
router.delete('/all', isAuthenticated, deleteAllUsers)
router.delete('/:id', isAuthenticated, isProfileOwner, deleteUser)


module.exports = router
