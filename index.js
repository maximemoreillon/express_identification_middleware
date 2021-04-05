const axios = require('axios')
const Cookies = require('cookies')
const dotenv = require('dotenv')

dotenv.config()




const retrieve_jwt = (req, res) => {

  /*
  Retrieving the token from either cookies or authorization header
  */

  return new Promise( (resolve, reject) => {
    let jwt = undefined

    // See if jwt available from authorization header
    if(!jwt){
      if(('authorization' in req.headers)) {
        jwt = req.headers.authorization.split(" ")[1]
      }
    }

    // Try to get JWT from cookies
    if(!jwt) {
      let cookies = new Cookies(req, res)
      jwt = cookies.get('jwt')
    }

    if(!jwt) {
      return reject(`JWT not found in either cookies or authorization header`)
    }

    resolve(jwt)
  })



}

module.exports = (opt) => {
  
  const options = opt || {}

   return (req, res, next) => {

      // Retrieves user information using the JWT provided by the user

      // retrieve JWT
      retrieve_jwt(req, res)
      .then(jwt => {
        // Send the token to the authentication api for verification

        const url = options.url
          || `${process.env.AUTHENTICATION_API_URL}/user_from_jwt`

        return axios.get(url, {params: {jwt} } )
      })
      .then( ({data}) => {

        // passing the user object to the route using res.locals
        res.locals.user = data

        console.log(data)

        // allow to request to proceed
        next()
      })
      .catch( error => {
        // In case the request fails, forward error message
        console.log(error)

        if(options.lax) next()
        else res.status(403).send(error)
      })
    }

}
