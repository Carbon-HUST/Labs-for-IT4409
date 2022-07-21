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
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const role = payload["role"];
      if (!role || role !== "admin")
        throw new CustomError.UnauthenticatedError("Authentication invalid");

      req.controller.body.id = payload.id;
      next();
    } catch (error) {
      throw new CustomError.UnauthenticatedError('Authentication invalid')
    }
}

module.exports = auth
