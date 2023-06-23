const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const helper = require('../tests/test_helper')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('Blogs vieving', () => {
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

describe('Blog saving', () => {
  test('request successfully creates a new blog post', async () => {
    const newBlog = {
      title: 'Some title',
      author: 'Some author',
      url: 'https://someurl.io/',
      likes: 7
    }
    const response = await api.post('/api/blogs').send(newBlog).expect(201)
    expect(response.body).toEqual(expect.objectContaining(newBlog))
    const currentBlogs = await helper.blogsInDb()
    expect(currentBlogs.length).toBe(helper.initialBlogs.length + 1)
  })

  test('if likes is missing it will default to 0', async () => {
    const newBlog = {
      title: 'Some title',
      author: 'Some author',
      url: 'https://someurl.io/'
    }
    const response = await api.post('/api/blogs').send(newBlog).expect(201)
    expect(response.body).toEqual(expect.objectContaining({ likes: 0 }))
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

describe('Blog deletion', () => {
  test('request successfully deletes a single blog post', async () => {
    const deletedBlog = helper.initialBlogs[0]
    await api.delete(`/api/blogs/${deletedBlog._id}`).expect(204)
    const currentBlogs = await helper.blogsInDb()
    expect(currentBlogs.length).toBe(helper.initialBlogs.length - 1)
    const currentBlogsTitles = currentBlogs.map((blog) => blog.title)
    expect(currentBlogsTitles).not.toContain(deletedBlog.title)
  })
})

describe('Blog updating', () => {
  test('request successfully updates blog likes count', async () => {
    const updatedBlogId = '5a422ba71b54a676234d17fb'
    const updatedBlog =   {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 3
    }
    const response = await api.put(`/api/blogs/${updatedBlogId}`).send(updatedBlog).expect(200)
    expect(response.body).toEqual(expect.objectContaining(updatedBlog))
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
