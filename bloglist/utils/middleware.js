const { KEY } = require('../utils/config')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const tokenExtractor = async(request, response, next) => {
  if (request){
    const authorization = await request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.replace('Bearer ', '')
      request.token = token
    }
  }
  next()
}

const userExtractor = async(request, response, next) => {
  if (request) {
    if (request.method === 'POST' || request.method === 'DELETE'){
      const decodedToken = jwt.verify(request.token, KEY)
      const user = await User.findOne({ _id: decodedToken.id })
      request.user = user
    }
  }
  next()
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }  else if (error.message.includes('blog')) {
    return response.status(400).json({ error: error.message })
  } else if (error.message === 'user') {
    return response.status(400).json({ error: error.message })
  } else if (error.message === 'deletion rejected') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

module.exports = { tokenExtractor, userExtractor, errorHandler }
