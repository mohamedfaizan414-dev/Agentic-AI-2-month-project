const userModel = require("../model/user.model.js")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")


async function registerUser(req,res){

    const {username,email,password} = req.body

    const isUserExists = await userModel.findOne({
        $or:[
            { username },
            { email }

        ]
    })
   
    if (isUserExists){
        return res.status(409).json({message: "User already exists"})
    }
    const hash = await bcrypt.hash(password, 10)
    const user = await userModel.create({
        username,
        email,
        password: hash
    })
    const token = jwt.sign({
        id : user._id},"e07339486a92b162db097ce1b5515f04")
        res.cookie("token",token)
        res.status(201).json({
            message:"User registered succesfully",
            user: user.username
        })
    
}

async function loginUser(req,res){
    const {username,email,password} = req.body
    const user = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    if(!user){
        return res.status(401).json({message: "invalid credentials"})
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid){
        return res.status(401).json({message: "invalid credentials"})
    }

    const token  = jwt.sign({
        id: user._id,

    },"e07339486a92b162db097ce1b5515f04")

    res.cookie("token",token)
    res.status(200).json({
        message: "user logged in succesfully",
        user: user.username
    })
}

// This function assumes the 'auth' middleware has already run
async function getMe(req, res) {
    try {
        // req.user is populated by the auth middleware
        const user = await userModel.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { registerUser, loginUser, getMe }