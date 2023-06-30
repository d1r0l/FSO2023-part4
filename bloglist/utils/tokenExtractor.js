const tokenExtractor = (request, response, next) => {
  if (request){
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.replace('Bearer ', '')
      request.token = token
    }
  }
  next()
}

module.exports = tokenExtractor
