
const express = require('express')
const showRouter = require('./routes/show.router')
const userRouter = require('./routes/user.router')
const app = express()
const PORT = 3002


app.use('/shows', showRouter)
app.use('/users', userRouter)

// https://stackoverflow.com/a/15188224
const runningAsScript = !module.parent;
/* istanbul ignore next */
if (runningAsScript) {
    app.listen(PORT, () => {
        console.log(`Listening on port: ${PORT}`)
    })
}


module.exports = app