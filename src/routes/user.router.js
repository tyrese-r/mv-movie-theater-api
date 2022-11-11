const express = require('express')
const { validationResult, body, param } = require('express-validator')
const { User } = require('../../models')

const userRouter = express.Router()

userRouter.use(express.json())

userRouter.get('/hello', (req, res) => {
    res.send(200)
})
// Get all users
userRouter.get('/all', async (req, res) => {

    const users = await User.findAll()
    // If nothing in users then return 204
    if (users.length === 0) {
        return res.sendStatus(204)
    }
    const usersJSON = users.map(u => u.toJSON())
    res.statusCode = 200
    return res.send(usersJSON)
})


// Get one user with id
userRouter.get('/id/:userid', param('userid').isInt(), async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.sendStatus(400)
    }
    // Look for user by pk
    const user = await User.findByPk(req.params.userid)
    if(user == null) {
        // User not found
        return res.sendStatus(404)
    }
    // Send user
    res.send(user.toJSON())
})

// Get users shows
userRouter.get('/id/:userid/shows', param('userid').isInt(), async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.sendStatus(400)
    }
    // Look for user by pk
    const user = await User.findByPk(req.params.userid)
    if(user == null) {
        // User not found
        return res.sendStatus(404)
    }
    // Get shows
    const shows = await user.getShows()
    if(shows.length == 0) {
        return res.sendStatus(204)
    }
    // Send user
    res.send(shows.map(s => s.toJSON()))
})

module.exports = userRouter