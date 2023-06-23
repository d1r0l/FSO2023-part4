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

describe('API GET test', () => {
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
})

describe('API POST test', () => {
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
})

describe('API DELETE test', () => {
  test('request successfully deletes a single blog post', async () => {
    const initialList = await api.get('/api/blogs')
    const deletedBlog = initialList.body[0]
    await api.delete(`/api/blogs/${deletedBlog.id}`).expect(204)
    const modifiedList = await api.get('/api/blogs')
    expect(modifiedList.body.length).toBe(initialList.body.length - 1)
    const modifiedListTitles = modifiedList.body.map((blog) => blog.title)
    expect(modifiedListTitles).not.toContain(deletedBlog.title)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
