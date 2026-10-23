const mongoose = require("mongoose")


const schema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password:{
        type:String,
        required: true
    },
    verficationCode: {
        type: String,
    },
    verificationCodeExpiresAt: { type: Date },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const userModel = mongoose.model("user",schema)

module.exports = userModel
