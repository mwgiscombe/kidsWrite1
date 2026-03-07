const express=require('express')
const router = express.Router()
const {isAuthenticated, isCommentAuthor, isEntryAuthor, isCommentOrEntryAuthor} = require('../middlewares/auth.middlewares')


const {
    fetchComments,
    createComment,
    updateComment,
    deleteAllCommentsForEntry,
    deleteComment,
    toggleLikeComment,
} = require('../controllers/comment.controllers')

router.get('/:entry', fetchComments)
router.post('/:id', isAuthenticated, createComment)
router.patch('/:id', isAuthenticated, isCommentAuthor, updateComment)
router.delete('/:entry/all', isAuthenticated, isEntryAuthor, deleteAllCommentsForEntry)
router.delete('/:id',isAuthenticated, isCommentOrEntryAuthor, deleteComment)
router.post('/:id/like', isAuthenticated, toggleLikeComment)

module.exports = router