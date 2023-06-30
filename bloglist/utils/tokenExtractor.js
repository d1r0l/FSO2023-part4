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

module.exports = tokenExtractor
