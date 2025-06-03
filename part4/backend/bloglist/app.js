const express = require('express')
const mongoose = require('mongoose')
const env = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')
const {
  requestLogger,
  unknownEndpoint,
  tokenExtractor,
  errorHandler,
} = require('./utils/middleware')

const app = express()

mongoose.set('strictQuery', false)

const mongoUrl = env.MONGODB_URI
logger.info(`connecting to MongoDB: ${mongoUrl}`)
mongoose
  .connect(mongoUrl)
  .then(() => logger.info('connected to MongoDB'))
  .catch((err) => logger.error(`could not connect to MongoDB: ${err}`))

app.use(express.json())
app.use(requestLogger)
app.use(tokenExtractor)

app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
