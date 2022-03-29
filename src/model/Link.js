const mongoose = require('mongoose')

const LinkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        ref: 'user'
    },
    oldLink: {
        type: String,
        required: true
    },
    shortLink: {
        type: String
    },
    click: {
        type: Number,
        default: 0
    }
}, {timestamps: true})

module.exports = mongoose.model('Link', LinkSchema)
