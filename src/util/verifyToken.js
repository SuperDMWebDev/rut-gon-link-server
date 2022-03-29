const jwt = require('jsonwebtoken')

class Verify {
    async verify(req, res, next) {
        //req.headers la gui chung voi header, req.headers['authentification] gui chung authentification 
        const authHeader = req.headers.token
        console.log(req.headers.token);
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Token not found'
            })
        }
        // authHeader tao tu jwt.sign (secret_key)
        try {
            jwt.verify(authHeader, process.env.SECRET_KEY, (err, user) => {
                if (err) {
                    return res.status(402).json({
                        success: false,
                        message: 'Token not invalid',
                        token: authHeader
                    })
                }

                req.body.userId = user.userId
                next()
            })
        }
        catch (err) {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            })
        }
    }
}

module.exports = new Verify()