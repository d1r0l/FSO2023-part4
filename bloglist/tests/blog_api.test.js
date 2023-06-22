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
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('blog amount is correct', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(helper.initialBlogs.length)
  })

  test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })

  test('request successfully creates a new blog post', async () => {
    const newBlog = {
      title: 'Some title',
      author: 'Some author',
      url: 'https://someurl.io/',
      likes: 7
    }
    const postResponse = await api.post('/api/blogs').send(newBlog).expect(201)
    expect(postResponse.body).toEqual(expect.objectContaining(newBlog))
    const getResponse = await api.get('/api/blogs')
    expect(getResponse.body.length).toBe(helper.initialBlogs.length + 1)
  })

  test('if likes is missing it will default to 0', async () => {
    const newBlog = {
      title: 'Some title',
      author: 'Some author',
      url: 'https://someurl.io/'
    }
    const postResponse = await api.post('/api/blogs').send(newBlog).expect(201)
    expect(postResponse.body).toEqual(expect.objectContaining({ likes: 0 }))
  })

  test('if the title are missing server responds code 400', async () => {
    const newBlog = {
      author: 'Some author',
      url: 'https://someurl.io/',
      likes: 7
    }
    await api.post('/api/blogs').send(newBlog).expect(400)
  })

  test('if the url are missing server responds code 400', async () => {
    const newBlog = {
      title: 'Some title',
      author: 'Some author',
      likes: 7
    }
    await api.post('/api/blogs').send(newBlog).expect(400)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
