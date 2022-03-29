const authRouter = require('./auth')
const linkRoter = require('./link')

function route(app) {
    app.use('/api/auth', authRouter)
    app.use('/', linkRoter)
}

module.exports = route