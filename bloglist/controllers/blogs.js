const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const users = await User.find({})
  const user = users[0]
  const body = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: user.id
  }

  const blog = new Blog(body)
  try {
    const returnedBlog = await blog.save()
    user.blogs = user.blogs.concat(returnedBlog._id)
    await user.save()
    response.status(201).json(returnedBlog)
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

blogsRouter.put('/:id', async (request, response) => {
  try {
    const result = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
    response.json(result)
  } catch {
    response.status(400).end()
  }
})

module.exports = blogsRouter
