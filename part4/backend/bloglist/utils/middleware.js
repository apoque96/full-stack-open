const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const requestLogger = (request, _response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (request, _response, next) => {
  const authorization = request.get('authorization')
  request.token = null
  if (authorization && authorization.startsWith('Bearer '))
    request.token = authorization.replace('Bearer ', '')

  next()
}

const userExtractor = (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id)
      return response.status(401).json({ error: 'token invalid' })

    User.findById(decodedToken.id).then((user) => {
      if (!user) return response.status(401).json({ error: 'token invalid' })

      request.user = user
      next()
    })
  } catch (err) {
    next(err)
  }
}

const errorHandler = (error, _request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  )
    return response
      .status(400)
      .json({ error: 'expected `username` to be unique' })
  else if (error.name === 'JsonWebTokenError')
    return response.status(401).json({ error: 'invalid token' })
  else if (error.name === 'TokenExpiredError')
    return response.status(401).json({
      error: 'token expired',
    })

  console.log(error)

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  tokenExtractor,
  userExtractor,
  errorHandler,
}
