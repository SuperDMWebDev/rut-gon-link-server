
const User = require('../model/User')

const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')

dotenv.config()

class UserController {
    // [POST] /register
    async register(req, res) {
        console.log(req.body);
        const { username, password, rePassword } = req.body

        if (password !== rePassword) {
            return res.status(202).json({
                success: false,
                message: 'Password does not match',
                enumError: 1
            })
        }

        if (password.length < 6) {
            return res.status(202).json({
                success: false,
                message: 'Password length is too short',
                enumError: 2
            })
        }

        if (!username || !password || !rePassword) {
            return res.status(202).json({
                success: false,
                message: 'Missing username or password',
                enumError: 3
            })
        }

        try {
            // const checkUser = await User.findOne({ username: username })
            // if (checkUser) {
            //     return res.status(202).json({
            //         success: false,
            //         message: 'username is already in use',
            //         enumError: 4
            //     })
            // }

            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)

            const user = new User({
                username: username,
                password: hashPassword
            })

            await user.save()

            return res.status(200).json({
                success: true,
                message: 'Create new user successfully',
            })
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                enumError: 0
            })
        }
    }

    // [POST] /login 
    async login(req, res) {
        const { username, password } = req.body

        if (!username || !password) {
            return res.status(202).json({
                success: false,
                message: 'Missing email or password',
                enumError: 1
            })
        }

        if (password.length < 6) {
            return res.status(202).json({
                success: false,
                message: 'Password length is too short',
                enumError: 2
            })
        }

        try {
            const user = await User.findOne({ username: username })

            if (!user) {
                return res.status(200).json({
                    success: false,
                    message: 'User not found',
                    enumError: 3
                })
            }

            const hashPassword = user.password
            const checkPassword = await bcrypt.compare(password, hashPassword)

            if (checkPassword) {
                const accessToken = await jwt.sign(
                    {
                        userId: user._id,
                        isAdmin: user.isAdmin
                    },
                    process.env.SECRET_KEY,
                    {
                        expiresIn: "5d"
                    }
                )
                console.log(accessToken);
                const { password, isAdmin, ...info } = user._doc

                return res.status(200).json({
                    success: true,
                    message: "Login successfully",
                    accessToken,
                    info
                })

            }
            else {
                return res.status(200).json({
                    success: false,
                    message: 'Password does not match',
                    enumError: 4
                })
            }
        }
        catch (err) {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                enumError: 0
            })
        }
    }

    // [PUT] /password
    async changePassword(req, res) {
        const { currentPassword, newPassword, rePassword, userId } = req.body

        if (newPassword !== rePassword) return res.status(202).json({
            success: false,
            message: 'Password does not match',
            enumError: 1
        })

        try {
            const user = await User.findById({ _id: userId })

            const hashPassword = user.password
            const checkPassword = await bcrypt.compare(currentPassword, hashPassword)

            if (!currentPassword || !newPassword || !rePassword) {
                return res.status(202).json({
                    success: false,
                    message: 'Missing email or password',
                    enumError: 4
                })
            }

            if (!checkPassword) return res.status(202).json({
                success: false,
                message: 'Incorrect password',
                enumError: 2
            })

            if (newPassword.length < 6) {
                return res.status(202).json({
                    success: false,
                    message: 'Password length is too short',
                    enumError: 3
                })
            }

            const salt = await bcrypt.genSalt(10)
            const hashedPass = await bcrypt.hash(newPassword, salt)

            const newUser = await User.findOneAndUpdate(
                {
                    _id: userId
                },
                {
                    password: hashedPass
                },
                {
                    returnDocument: 'after'
                }
            )

            console.log(newUser);

            const { password, isAdmin, ...info } = newUser._doc

            return res.status(200).json({
                success: true,
                user: info
            })

        }
        catch (err) {
            console.log(err);

            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                enumError: 0
            })
        }
    }
}


module.exports = new UserController()