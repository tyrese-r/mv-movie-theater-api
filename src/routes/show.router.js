const express = require('express')


const showRouter = express.Router()

showRouter.use(express.json())

module.exports = showRouter