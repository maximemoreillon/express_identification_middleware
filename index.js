const axios = require('axios')
const Cookies = require('cookies')


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
      jwt = cookies.get('jwt') || cookies.get('token')
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

        res.locals.jwt = jwt

        const url = options.url

        const axios_options = {
          headers: {
            'Authorization': `Bearer ${jwt}`
          }
        }

        return axios.get(url, axios_options )
      })
      .then( ({data}) => {
        // passing the user object to the route using res.locals
        res.locals.user = data

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
