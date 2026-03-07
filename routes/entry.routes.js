const express=require('express')
const router = express.Router()
const upload = require('../middlewares/upload')
const {isAuthenticated, isEntryAuthor} = require('../middlewares/auth.middlewares')


const {
    fetchEntries,
    createEntry,
    updateEntry,
    deleteEntry,
    searchEntries,
    toggleLikeEntry
} = require('../controllers/entry.controllers')



router.get('/', isAuthenticated, fetchEntries)
router.get('/search', isAuthenticated, searchEntries)
router.post('/', upload.single('entryImg'), isAuthenticated, createEntry)
router.patch('/:id', isAuthenticated, isEntryAuthor, updateEntry)
router.delete('/:id', isAuthenticated, isEntryAuthor, deleteEntry)
router.post('/:id', isAuthenticated, toggleLikeEntry)

module.exports = router