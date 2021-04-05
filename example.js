const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const auth = require('./index.js')

dotenv.config()

const EXPRESS_PORT = 7070

const app = express()
app.use(bodyParser.json())
app.use(cors())

const options = { url: `https://api.authentication.maximemoreillon.com/user_from_jwt` }
app.use(auth(options))


app.get('/', (req, res) => res.send(res.locals.user) )


app.listen(EXPRESS_PORT, () => console.log(`[Express] App listening on ${EXPRESS_PORT}`) )
