const express = require('express')
const app = express()
const dotenv = require('dotenv')

const db=require('./config/connectDB');
const router = require('./router/index')
const cors = require('cors');
var whitelist = ['http://localhost:3000','https://shortlinkappdm.herokuapp.com/'];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
dotenv.config()

const port = process.env.PORT || 5000

// app.use(cors())...

app.use(express.urlencoded({extended: true}))

app.use(express.json())

db.connect()

router(app)

app.listen(port, () => {
    console.log(`Listening port ${port}`);
})