const { MONGODB_URI } = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')

mongoose.set('strictQuery', false)

const connectToMongoose = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    logger.info('Connected to MongoDB')
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error.message)
  }
}

connectToMongoose()

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

module.exports = app
