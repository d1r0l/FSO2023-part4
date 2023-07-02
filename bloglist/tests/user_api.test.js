const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const helper = require('../tests/test_helper')
const User = require('../models/user')
const Blog = require('../models/blog')


beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('Users vieving', () => {
  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('user amount is correct', async () => {
    const response = await api.get('/api/users')
    expect(response.body.length).toBe(helper.initialUsers.length)
  })

  test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/users')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('User proper saving', () => {
  test('request successfully creates a new user', async () => {
    const newUser = {
      username: 'anonimous',
      password: 'password',
      name: 'John Doe'
    }
    const expectedUser = {
      username: newUser.username,
      name: newUser.name
    }
    const response = await api.post('/api/users').send(newUser).expect(201)
    expect(response.body).toEqual(expect.objectContaining(expectedUser))
    const currentUsers = await helper.usersInDb()
    expect(currentUsers.length).toBe(helper.initialUsers.length + 1)
  })
})

describe('Server responds code 400 and error message if unpropriate user is saved', () => {
  test('if password is missing', async () => {
    const newUser = {
      username: 'anonimous',
      name: 'John Doe'
    }
    const response = await api.post('/api/users').send(newUser).expect(400)
    expect(response.body).toContain('User validation failed: password')
    expect(response.body).toContain('is required')
  })

  test('if password is less than 3 characters', async () => {
    const newUser = {
      username: 'anonimous',
      password: 'pw',
      name: 'John Doe'
    }
    const response = await api.post('/api/users').send(newUser).expect(400)
    expect(response.body).toContain('User validation failed: password')
    expect(response.body).toContain('is shorter than the minimum allowed length')
  })

  test('if username is missing', async () => {
    const newUser = {
      password: 'password',
      name: 'John Doe'
    }
    const response = await api.post('/api/users').send(newUser).expect(400)
    expect(response.body).toContain('User validation failed: username')
    expect(response.body).toContain('is required')
  })

  test('if username is less than 3 characters', async () => {
    const newUser = {
      username: 'an',
      password: 'password',
      name: 'John Doe'
    }
    const response = await api.post('/api/users').send(newUser).expect(400)
    expect(response.body).toContain('User validation failed: username')
    expect(response.body).toContain('is shorter than the minimum allowed length')
  })

  test('if username is not unique', async () => {
    const newUser = {
      username: 'vscode',
      password: 'password',
      name: 'John Doe'
    }
    const response = await api.post('/api/users').send(newUser).expect(400)
    expect(response.body).toContain('User validation failed: username')
    expect(response.body).toContain('to be unique')
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })
})
