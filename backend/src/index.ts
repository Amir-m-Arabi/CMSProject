import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import compression from 'compression'
import mongoose from 'mongoose'

const app = express()
app.use(cors({
    credentials : true,
}))
app.use(bodyParser.json())
app.use(compression())
app.use(cookieParser())

mongoose.Promise = Promise
mongoose.connect("mongodb://localhost:27017/CMS")
mongoose.connection.on('error' , (error:Error) => console.log(error))

app.listen(4000 , (error) =>{
    if(error){
        console.log(error)
    }else{
        console.log("Server running")
    }
})
