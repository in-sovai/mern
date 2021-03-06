const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../model/userModel')

// Register User
const registerUser = asyncHandler( async (req, res) =>{
    const { name, email, password } = req.body
    if(!name || !email || !password) {
        res.status(400)
        throw new Error('Please add all the file') 
    }
    // Check is user exist
    const userExist = await User.findOne( {email} )
    if(userExist) {
        res.status(400)
        throw new Error('User aredy exist')
    }
    // Hash pass
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(password, salt)
    // Create user
    const user =  await User.create({
        name,
        email,
        password: hashedPass
    })

    if(user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            token: generateToken(user.id)
        })
    } else {
        res.status(400)
        throw  new Error('Invalid user data')
    }
})

// Login User
const loginUser  = asyncHandler( async (req, res) =>{
    const { email, password} = req.body
    //Check for user email
    const user = await User.findOne({ email })
    if(user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            token: generateToken(user.id)
        })
    } else {
        res.status(400)
        throw  new Error('Invalid credentials')
    }
})
// @access Private
const getMe  = asyncHandler( async (req, res) =>{
    const { _id, name, email} = await User.findById(req.user.id)// cz in authMiddle we set req.user = ...
    res.status(200).json({
        id: _id,
        name,
        email,
        token: generateToken(_id)  
    })
})

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d'})
}
module.exports =  { registerUser, loginUser, getMe }