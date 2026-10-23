
const mongoose = require("mongoose")
const userModel = require('../model/user.model')
const chatModel = require('../model/chat.model')
async function  connectDB(){
    try{
   await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
   await Promise.all([userModel.init(), chatModel.init()])
    console.log("connected")
}
    
    catch(err){
        console.error('Database connection error',err)
        throw err
    }
}
module.exports = connectDB
