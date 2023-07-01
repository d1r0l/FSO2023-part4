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
  const decodedToken = jwt.verify(request.token, KEY)
  const user = await User.findOne({ _id: decodedToken.id })
  if (!user) throw new Error ('invalid user id')
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
})

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, KEY)
  const blog = await Blog.findOne({ _id: request.params.id })
  if (!blog) throw new Error ('invalid blog id')
  const user = await User.findOne({ _id: decodedToken.id })
  if (!user) throw new Error ('invalid user id')
  if (user._id.toString() === blog.user.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else throw new Error('deletion rejected: blog created by another user')
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
