const express=require('express')
const router = express.Router()
const upload = require('../middlewares/upload')
<<<<<<< HEAD
const {isAuthenticated, isEntryAuthor} = require('../middlewares/auth.middlewares')
=======
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2


const {
    fetchEntries,
    createEntry,
    updateEntry,
    deleteEntry,
    searchEntries,
    toggleLikeEntry
} = require('../controllers/entry.controllers')
<<<<<<< HEAD



router.get('/', isAuthenticated, fetchEntries)
router.get('/search', isAuthenticated, searchEntries)
router.post('/', upload.single('entryImg'), isAuthenticated, createEntry)
router.patch('/:id', isAuthenticated, isEntryAuthor, updateEntry)
router.delete('/:id', isAuthenticated, isEntryAuthor, deleteEntry)
router.post('/:id', isAuthenticated, toggleLikeEntry)
=======
console.log("toggleLikeEntry is:", toggleLikeEntry)
router.get('/', fetchEntries)
router.get('/search', searchEntries)
router.post('/', upload.single('entryImg'), createEntry)
router.patch('/:id', updateEntry)
router.delete('/:id', deleteEntry)
router.post('/:id', toggleLikeEntry)
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2

module.exports = router