import axios from "axios"
import Cookies from "cookies"
import { Request, Response, NextFunction } from "express"

const retrieve_jwt = (req: Request, res: Response) =>
  new Promise((resolve, reject) => {
    // Retrieving the token from either cookies or authorization header
    // NOTE: Did not need to be a promise

    let { query, headers } = req

    let jwt

    // See if jwt available from authorization header
    if (!jwt && headers?.authorization) {
      jwt = headers?.authorization.split(" ")[1]
    }

    // Try to get JWT from cookies
    if (!jwt) {
      const cookies = new Cookies(req, res)
      jwt = cookies.get("jwt") || cookies.get("token")
    }

    // Try to get the JWT from query parameters
    if (!jwt) {
      jwt = query.jwt || query.token
    }

    if (!jwt)
      return reject(`JWT not found in either cookies or authorization header`)

    resolve(jwt)
  })

// NOTE: Middleware itself cannot be async
const middleware =
  (options: any = {}) =>
  (req: Request, res: Response, next: NextFunction) => {
    // Retrieves user information using the JWT provided by the user

    // retrieve JWT
    retrieve_jwt(req, res)
      .then((jwt) => {
        // Send the token to the authentication api for verification

        res.locals.jwt = jwt

        const { url } = options
        if (!url) throw "[Auth middleware] Authentication API URL not provided"

        const headers = { Authorization: `Bearer ${jwt}` }

        return axios.get(url, { headers })
      })
      .then(({ data }) => {
        // passing the user object to the route using res.locals
        res.locals.user = data

        // allow to request to proceed
        next()
      })
      .catch((error) => {
        // In case the request fails, forward error message
        console.log(error)

        if (options.lax) next()
        else return res.status(403).send(error)
      })
  }

export = middleware
