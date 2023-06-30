const { KEY } = require('../utils/config')
const loginRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  const user = await User.findOne({ username })
  try {
    if (!user) {
      throw new Error('invalid username')
    }
    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
    if (passwordCorrect) {
      const userForToken = {
        username: user.username,
        id: user._id
      }
      const token = jwt.sign(userForToken, KEY)
      response
        .status(200)
        .json({ token, username: user.username, name: user.name })
    } else {
      throw new Error('invalid password')
    }
  } catch (error) {
    response.status(401).json(error.message)
  }
})

module.exports = loginRouter
