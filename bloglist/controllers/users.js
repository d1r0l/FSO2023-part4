const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
    .populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, password, name } = request.body
  if (!password) {
    response.status(400).json('User validation failed: password: Path `password` is required.')
  } else if (password.length < 3) {
    response.status(400).json(`User validation failed: password: Path \`password\` (\`${password}\`) is shorter than the minimum allowed length (3).`)
  } else {
    try {
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)
      const user = new User({
        username: username,
        passwordHash: passwordHash,
        name: name
      })
      const savedUser = await user.save()
      response.status(201).json(savedUser)
    } catch (error) {
      response.status(400).json(error.message)
    }
  }
})

module.exports = usersRouter
