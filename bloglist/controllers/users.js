const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  // .populate('blogs', { content: 1, important: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, password, name } = request.body
  if (password.length < 3) {
    response.status(400).json(`Password validation failed: password: Path \`password\` (\`${password}\`) is shorter than the minimum allowed length (3).`)
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
