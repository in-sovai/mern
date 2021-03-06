const asyncHandler = require('express-async-handler')
const Goal = require('../model/goalModel')
const User = require('../model/userModel')

const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find({ user: req.user.id })
    res.status(200).json(goals)
   
})

const setGoals = asyncHandler(async (req, res) => {
    if(!req.body.text){
        res.status(400)
        throw new Error("Please add a text field")
    }else{
        const goals = await Goal.create({
            text: req.body.text,
            user: req.user.id
        })
        res.status(200).json(goals)
    }
})

const updateGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.findById(req.params.id)
    if(!goals){
        res.status(400)
        throw new Error('goal not found')
    }
    const user = await User.findById(req.user.id)
    // Check for user
    if(!user){
        res.status(401)
        throw new Error('User not found ')
    }
    // Make sure the login user mathches goals user
    if(goals.user.toString() !== user.id ){
        res.status(401)
        throw new Error('User Unauthorized')
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true, })
    res.status(200).json(updatedGoal)
})
const deleteGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.findById(req.params.id)
    if(!goals){
        res.status(400)
        throw new Error('goal not found')
    }
    const user = await User.findById(req.user.id)
    // Check for user
    if(!user){
        res.status(401)
        throw new Error('User not found ')
    }
    // Make sure the login user mathches goals user
    if(goals.user.toString() !== user.id ){
        res.status(401)
        throw new Error('User Unauthorized')
    }
    await goals.remove()
    res.status(200).json({ id: req.params.id })
})

module.exports =  { getGoals, setGoals, updateGoals, deleteGoals, }