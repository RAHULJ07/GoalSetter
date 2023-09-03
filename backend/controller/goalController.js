const asyncHandler = require('express-async-handler')

// @desc    Get goals
// @route   GET api/goals
// @access Private
const getGoals = asyncHandler(async (req,res) => {
    res.status(200).json({message: "get goals"})
})

// @desc    Set goals
// @route   POST api/goals/
// @access Private
const postGoals = asyncHandler(async (req,res) => {
    if(!req.body.text){
        res.status(400)
        throw new Error('Please add a text field')
    }
    res.status(200).json({message: "Set Goal"})
})

// @desc    update goals
// @route   PUT api/goals/:id
// @access Private
const putGoals = asyncHandler(async (req,res) => {
    res.status(200).json({message: `update ${req.params.id} goals`})
})

// @desc    delete goals
// @route   DELETE api/goals/:id
// @access Private
const deleteGoals = asyncHandler(async (req,res) => {
    res.status(200).json({message: `delete ${req.params.id} goals`})
})

module.exports = {
    getGoals,
    postGoals,
    putGoals,
    deleteGoals
}