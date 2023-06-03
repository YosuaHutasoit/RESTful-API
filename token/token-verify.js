const jwt = require('jsonwebtoken');

let verifyToken = (req, res, next) => {
    let response = {}
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) {
        response = {
            status: "ERROR",
            message: "Authorization Failed"
        }
        res.status(401).json(response)
        return
    }
  
    jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
        console.log(error)
        if (error) {
            response = {
                status: "ERROR",
                message: error
            }
            res.status(401).json(response)
            return
        }
        req.user = user
        next()
  })
  }

  module.exports = verifyToken