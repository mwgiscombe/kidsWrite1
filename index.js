const express = require('express')
const mongoose = require('mongoose')
<<<<<<< HEAD
const cookieParser = require('cookie-parser')
const cors = require('cors')
=======
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
const dotenv = require('dotenv')
dotenv.config()

const userRoutes = require('./routes/user.routes')
const entryRoutes = require('./routes/entry.routes')
const groupRoutes = require('./routes/group.routes')
const commentRoutes = require('./routes/comment.routes')
<<<<<<< HEAD
const notificationRoutes = require('./routes/notification.routes')

const app=express()
app.use(express.urlencoded({ extended: true }))

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true
}
 ))
app.use('/uploads', express.static('uploads'))


  
  // Add AFTER all routes
  
app.use('/users', userRoutes)
app.use('/notifications', notificationRoutes)
app.use('/groups', groupRoutes)
app.use('/entries', entryRoutes)
app.use('/comments', commentRoutes)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body)
    next()
  })
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err)
    res.status(500).json({ message: err.message })
  })
=======

const app=express()
app.use(express.urlencoded({extended: false}))
app.use('/uploads', express.static('uploads'))
app.use(express.json())

app.use('/users', userRoutes)
app.use('/groups', groupRoutes)
app.use('/entries', entryRoutes)
app.use('/comments', commentRoutes)
>>>>>>> 8f7b32d9e4dd190c99de033ad4e98e98d8f76fa2
app.get('/', (req, res)=>{
    res.send('i am a robot')
})
mongoose.connect(process.env.MONGODB_URL)
    .then(()=> 
        {
            console.log('You have been connected!')
            app.listen(process.env.PORT, () =>{
            console.log('i am godzilla')
             })
    
        }).catch(() => console.log('you fail!'))

