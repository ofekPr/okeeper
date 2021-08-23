import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

// @desc    Auth user & get token
// @route   POST /:userName/api/user/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && (await user.matchPasswords(password))) {
        const pages = user.pages.filter(page => page.publicViewing)
        res.json({
            _id: user._id,
            userName: user.userName,
            email: user.email,
            pages,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})

// @desc    Register a new user
// @route   POST /:userName/api/user/
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { userName, email, password } = req.body

    const userExsits = (await User.findOne({ email })) || (await User.findOne({ userName }))

   if (userExsits) {
       res.status(400)
       throw new Error ('User already exists')
   }

   const user = await User.create({
       userName,
       email,
       password
   })

   if (user) {
       res.status(201).json({
        _id: user._id,
        userName: user.userName,
        email: user.email,
        pages: [],
        token: generateToken(user._id)
    })
   } else {
       res.status(400)
       throw new Error ('Invalid user data')
   }
})

// @desc    Get user profile
// @route   GET /:userName/api/user/profile
// @access  Privet
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        const pages = user.pages.filter(page => page.publicViewing)
        res.json({
            _id: user._id,
            userName: user.userName,
            email: user.email,
            pages
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

// @desc    Update user profile
// @route   PUT /:userName/api/user/profile
// @access  Privet
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {    
        const pages = user.pages.filter(page => page.publicViewing)

        user.userName = req.body.userName || user.userName
        user.email = req.body.email || user.email
        if (req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            userName: updatedUser.userName,
            email: updatedUser.email,
            pages,
            token: generateToken(updatedUser._id)
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

export {
    authUser, 
    getUserProfile,
    registerUser,
    updateUserProfile
}