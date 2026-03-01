const express=require('express')
const router = express.Router()
const upload = require('../middlewares/upload')


const {
    fetchEntries,
    createEntry,
    updateEntry,
    deleteEntry,
    searchEntries,
    toggleLikeEntry
} = require('../controllers/entry.controllers')
console.log("toggleLikeEntry is:", toggleLikeEntry)
router.get('/', fetchEntries)
router.get('/search', searchEntries)
router.post('/', upload.single('entryImg'), createEntry)
router.patch('/:id', updateEntry)
router.delete('/:id', deleteEntry)
router.post('/:id', toggleLikeEntry)

module.exports = router