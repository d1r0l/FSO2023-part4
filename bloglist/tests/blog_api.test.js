const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const helper = require('../tests/test_helper')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('API test', () => {
  test ('blogs are returned as json', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test ('blog amount is correct', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(helper.initialBlogs.length)
  })

  test ('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })

  test ('request to the /api/blogs URL successfully creates a new blog post', async () => {
    const newBlog = {
      title: 'Some title',
      author: 'Some author',
      url: 'https://someurl.io/',
      likes: 7
    }
    const saveResponse = await new Blog(newBlog).save()
    expect(saveResponse).toEqual(expect.objectContaining(newBlog))
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(helper.initialBlogs.length + 1)
  })

  test ('if likes is missing it will default to 0', async () => {
    const newBlog = {
      title: 'Some title',
      author: 'Some author',
      url: 'https://someurl.io/'
    }
    const saveResponse = await new Blog(newBlog).save()
    expect(saveResponse).toEqual(expect.objectContaining({ likes: 0 }))
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})