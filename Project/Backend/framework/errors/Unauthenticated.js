const CustomError = require('./CustomError');

class UnauthenticatedError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = UnauthenticatedError;