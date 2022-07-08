const CustomError = require('./CustomError')
const UnauthenticatedError = require('./Unauthenticated')
const NotFoundError = require('./NotFound')
const BadRequestError = require('./BadRequest')
const UnsupportedMediaTypeError = require('./UnsupportedMediaType');

module.exports = {
  CustomError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  UnsupportedMediaTypeError
}