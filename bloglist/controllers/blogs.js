const { KEY } = require('../utils/config')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, KEY)
    const user = await User.findOne({ _id: decodedToken.id })
    const body = {
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes,
      user: user._id
    }
    const blog = new Blog(body)

    const returnedBlog = await blog.save()
    user.blogs = user.blogs.concat(returnedBlog._id)
    await user.save()
    response.status(201).json(returnedBlog)
  } catch (error) {
    if (error.message.includes('invalid')) response.status(401).json('invalid token')
    else response.status(400).end()
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
