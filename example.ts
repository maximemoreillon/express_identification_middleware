import middleware from './index'
import Express from 'express'

const app = Express()
const EXPRESS_PORT = 7071
const options = { url: `https://api.users.maximemoreillon.com/v2/users/self` }

app.use(middleware(options))


app.listen(EXPRESS_PORT, () => {
    console.log(`[Express] Listening on port ${EXPRESS_PORT}`)
})