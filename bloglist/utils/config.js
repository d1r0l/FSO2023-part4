require('dotenv').config()

const SALTROUNDS = 10
const KEY = process.env.KEY
const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

module.exports = {
  SALTROUNDS,
  KEY,
  MONGODB_URI,
  PORT
}
