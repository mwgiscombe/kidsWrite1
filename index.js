const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

const userRoutes = require('./routes/user.routes')
const entryRoutes = require('./routes/entry.routes')
const groupRoutes = require('./routes/group.routes')
const commentRoutes = require('./routes/comment.routes')

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


app.use('/users', userRoutes)
app.use('/groups', groupRoutes)
app.use('/entries', entryRoutes)
app.use('/comments', commentRoutes)
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

