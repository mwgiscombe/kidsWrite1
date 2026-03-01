const express= require('express')
const router = express.Router()
const upload = require('../middlewares/upload')
const {
    fetchUsers,
    searchUsers,
    userDashboard,
    createUser,
    updateUser,
    deleteUser,
    deleteAllUsers
} = require('../controllers/user.controllers')


router.get('/', fetchUsers)
router.get('/search', searchUsers)
router.get('/:id/dashboard', userDashboard)
router.post('/', upload.single('profileImg'), createUser)
router.patch('/:id', updateUser)
router.delete('/all', deleteAllUsers)
router.delete('/:id', deleteUser)


module.exports = router
