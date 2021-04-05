# Express identification middleware


## Usage

```
// Crerate an express app
const app = require('express')()

// Import the middleware
const auth = require('@moreillon/express_identification_middleware')

const options = { url: 'AUTHENTICATION_API_URL' }

// Register the middleware
app.use(group_auth(options))
```
