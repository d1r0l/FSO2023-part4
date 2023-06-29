const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

const nonExistingBlogId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(note => note.toJSON())
}

const initialUsers = [
  {
    _id: '649c5a3dbde108c86dfdc722',
    username: 'vscode',
    passwordHash: '$2b$10$PiweHyBWpfK.mvyuFC76eOgv73u3DJrc/0CexaRFZ7jwjyyjruh7m',
    name: 'Visualio Studiolo Codebua',
    __v: 0
  },
  {
    _id: '649c5fb731e265bf95647f9f',
    username: 'nastya',
    passwordHash: '$2b$10$K3LE2Pakui3mvohGRwttMu2wMkGMe98VsRAQ22vdI7hk5IwyI42H2',
    name: 'Anastasiia Konkova',
    __v: 0
  },
  {
    _id: '649c6894bf0369bed205d94e',
    username: 'postman',
    passwordHash: '$2b$10$txHin8C5sK9CwrQ1akBWvum0IJjeDoyj3B8U11yFgpoKUL29IGOGO',
    name: 'Pochtalion Pechkin',
    __v: 0
  },
]

const nonExistingUserId = async () => {
  const user = new User({ username: 'willremovethissoon' })
  await user.save()
  await user.deleteOne()

  return user._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs, nonExistingBlogId, blogsInDb, initialUsers, nonExistingUserId, usersInDb
}
