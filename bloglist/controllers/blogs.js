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
    if (!user) throw new Error ('User')
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
    if (error.name.includes('JsonWebTokenError')) response.status(401).json('invalid token')
    else response.status(400).json(error.message)
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, KEY)
    const blog = await Blog.findOne({ _id: request.params.id })
    if (!blog) throw new Error ('Blog')
    const user = await User.findOne({ _id: decodedToken.id })
    if (!user) throw new Error ('User')
    if (user._id.toString() === blog.user.toString()) {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    } else throw new Error('deletion rejected: blog created by another user')
  } catch (error) {
    if (error.name.includes('JsonWebTokenError')) {
      response.status(401).json('invalid token')
    } else if (error.message.includes('Blog')) {
      response.status(400).json('invalid blog id')
    } else if (error.message.includes('User')) {
      response.status(400).json('invalid user id')
    } else {
      response.status(400).json(error.message)
    }
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
