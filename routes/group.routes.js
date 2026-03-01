const express=require('express')
const router = express.Router()
const upload = require('../middlewares/upload')

const {
    fetchGroups,
    searchGroups,
    groupDashboard,
    createGroup,
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
router.delete('/all', deleteAllGroups)

module.exports = router