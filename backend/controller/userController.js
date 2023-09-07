const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// @desc    register new user
// @route   POST /api/users
// @access Public
const registerUser = asyncHandler(async(req,res) => {
    const {name, email, password} = req.body
    if(!name || !email || !password){
        res.status(400)
        throw new Error('Please add all fields')
    }

    //Check if user exists
    const user = await User.findOne({email})

    if(user){
        res.status(400)
        throw new Error('User already exists')
    }

    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //create user

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if(newUser){
        res.status(201).json({
            _id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            token: generateToken(newUser.id)
        })
    }else{
        res.status(400)
        throw new Error('Invaild user data')
    }
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access Private
const loginUser = asyncHandler(async(req,res) => {
    const {email, password} = req.body
    if(!email || !password){
        res.status(400)
        throw new Error('Please add all fields')
    }

    const user = await User.findOne({email})

    if(user && (await bcrypt.compare(password, user.password))){
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id)
        })
    }else{
        res.status(400)
        throw new Error('invalid credentials')
    }
})

// @desc    get user data
// @route   GET /api/users/me
// @access Public
const getMe = asyncHandler(async(req,res) => {
    const { _id, name, email } = await User.findById(req.user.id)

    res.status(200)
    res.json({
        id: _id,
        name,
        email
    })
})

//generate JWT
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}



module.exports = {
    registerUser,
    loginUser,
    getMe
}