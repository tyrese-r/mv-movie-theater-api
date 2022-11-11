const express = require('express')
const { User } = require('../../models')

const userRouter = express.Router()

userRouter.use(express.json())

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

module.exports = userRouter