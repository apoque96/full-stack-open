const app = require('./app')
const env = require('./utils/config')
const logger = require('./utils/logger')

const PORT = env.PORT || 3003
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})
