
const userModel = require("../model/user.model.js")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { verify, welcome } = require("../middleware/email.js")

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
    verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await userModel.create({
        username,
        email,
        password: hash,
        verficationCode: verificationCode,
        

    })

    const token = jwt.sign({
        id : user._id
    },process.env.JWT_SECRET)
    

    await verify(user.email, user.verificationCode)

     // Generate a random 6-digit OTP
    

    // ✅ send token instead of cookie
    res.status(201).json({
        message:"User registered succesfully",
        user: user.username,
        token
    })
}

async function verifyEmail(req,res){
    const {otp} = req.body
    user = await userModel.findOne({verficationCode: otp})

    if(!user){
        return res.status(400).json({message: "Invalid OTP"})
    }
    user.isVerified = true
    user.verficationCode = undefined
    await user.save()
    await welcome(user.email, user.username)
    res.status(200).json({message: "Email verified successfully"})
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
    },process.env.JWT_SECRET)

   
    res.status(200).json({
        message: "user logged in succesfully",
        user: user.username,
        token
    })
}

// getMe stays SAME
async function getMe(req, res) {
    try {
        const user = await userModel.findById(req.user._id).select("-password")
        if (!user) return res.status(404).json({ message: "User not found" })
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

module.exports = { registerUser, loginUser, getMe, verifyEmail }