const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const pjson = require('./package.json')
const auth = require('./index.js')

dotenv.config()

// Mongoose connection
const mongoose_options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

const EXPRESS_PORT = process.env.EXPRESS_PORT || 80

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(auth())



app.get('/', (req, res) => {
  res.send(res.locals.user)
})


app.listen(EXPRESS_PORT, () => {
  console.log(`[Express] App listening on ${EXPRESS_PORT}`)
})