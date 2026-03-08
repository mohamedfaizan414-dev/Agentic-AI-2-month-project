const mongoose = require("mongoose")


const schema = new mongoose.Schema({
    username:{
        type: String,
        require: true,
        unique: true
    },

    email:{
        type: String,
        require: true,
        unique: true
    },
    password:{
        type:String,
        required: true
    }
})

const userModel = mongoose.model("user",schema)

module.exports = userModel
