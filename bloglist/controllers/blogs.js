const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    const blog = new Blog(request.body)
    await blog.save().then((result) => {
      response.status(201).json(result)
    })
  } catch (exeption) {
    response.status(400).end()
    next(exeption)
  }
})

module.exports = blogsRouter
