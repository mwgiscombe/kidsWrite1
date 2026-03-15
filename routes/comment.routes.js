const express=require('express')
const router = express.Router()
<<<<<<< HEAD
const {isAuthenticated, isCommentAuthor, isEntryAuthor, isCommentOrEntryAuthor} = require('../middlewares/auth.middlewares')
=======
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2


const {
    fetchComments,
    createComment,
    updateComment,
    deleteAllCommentsForEntry,
    deleteComment,
    toggleLikeComment,
} = require('../controllers/comment.controllers')

router.get('/:entry', fetchComments)
<<<<<<< HEAD
router.post('/:id', isAuthenticated, createComment)
router.patch('/:id', isAuthenticated, isCommentAuthor, updateComment)
router.delete('/:entry/all', isAuthenticated, isEntryAuthor, deleteAllCommentsForEntry)
router.delete('/:id',isAuthenticated, isCommentOrEntryAuthor, deleteComment)
router.post('/:id/like', isAuthenticated, toggleLikeComment)
=======
router.post('/:id',  createComment)
router.patch('/:id', updateComment)
router.delete('/:entry/all', deleteAllCommentsForEntry)
router.delete('/:id', deleteComment)
router.post('/:id/like', toggleLikeComment)
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2

module.exports = router