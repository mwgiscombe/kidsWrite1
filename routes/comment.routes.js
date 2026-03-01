const express=require('express')
const router = express.Router()


const {
    fetchComments,
    createComment,
    updateComment,
    deleteAllCommentsForEntry,
    deleteComment,
    toggleLikeComment,
} = require('../controllers/comment.controllers')

router.get('/:entry', fetchComments)
router.post('/:id',  createComment)
router.patch('/:id', updateComment)
router.delete('/:entry/all', deleteAllCommentsForEntry)
router.delete('/:id', deleteComment)
router.post('/:id/like', toggleLikeComment)

module.exports = router