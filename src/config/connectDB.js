const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config()

async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connect successfully')
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = { connect }