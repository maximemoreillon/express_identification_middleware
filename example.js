const express = require('express')
const cors = require('cors')
const auth = require('./index.js')

const EXPRESS_PORT = 7070

const app = express()
app.use(express.json())
app.use(cors())

const options = { url: `https://api.users.maximemoreillon.com/v2/users/self` }
app.use(auth(options))

app.get('/', (req, res) => res.send(res.locals.user) )

app.listen(EXPRESS_PORT, () => console.log(`[Express] App listening on ${EXPRESS_PORT}`) )
