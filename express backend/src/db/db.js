const mongoose = require("mongoose")
async function  connectDB(){
    try{
   await mongoose.connect(
        'mongodb+srv://faizan:SX5d2NuMnzb9CXwn@first-cluster.mdaga2e.mongodb.net/Travelagent'
    )
    console.log("connected")}
    catch(err){
        console.error('Database connection error',err)
    }
}
module.exports = connectDB