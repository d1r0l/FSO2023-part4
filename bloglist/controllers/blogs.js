const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  try {
    const result = await blog.save()
    response.status(201).json(result)
  } catch {
    response.status(400).end()
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch {
    response.status(400).end()
  }
})

module.exports = blogsRouter
