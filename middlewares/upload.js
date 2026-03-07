const multer = require('multer');
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (req.originalUrl.includes('users')) {
        cb(null, 'uploads/users/')
      } else if (req.originalUrl.includes('entries')) {
        cb(null, 'uploads/entries/')
      } else {
        cb(null, 'uploads/misc/')
      }
    },
  
    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname)
  
      if (req.originalUrl.includes('users')) {
        cb(null, 'userImg-' + Date.now() + Math.floor(Math.random() * 10) + extension)
      } else if (req.originalUrl.includes('entries')) {
        cb(null, 'entryImg-' + Date.now() + Math.floor(Math.random() * 10) + extension)
      } else {
        cb(null, 'Img-' + Date.now() + Math.floor(Math.random() * 10) + extension)
      }
    }
  })
  
const upload = multer({ storage });
module.exports = upload