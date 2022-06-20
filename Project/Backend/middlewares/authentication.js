const jwt = require('jsonwebtoken')
const CustomError = require('../framework').CustomError;

const auth = (req, res, next) => {
    // check header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw new CustomError.UnauthenticatedError('Authentication invalid')
    }
    const token = authHeader.split(' ')[1]

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET)
      // attach the user to the job routes
      //req.user = { userId: payload.userId, name: payload.name }
      req.id = payload.id;
      next()
    } catch (error) {
      throw new CustomError.UnauthenticatedError('Authentication invalid')
    }
}

module.exports = auth
