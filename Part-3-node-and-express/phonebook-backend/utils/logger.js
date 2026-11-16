import morgan from 'morgan'

morgan.token('body', (request) =>
  request.method === 'POST' ? JSON.stringify(request.body) : ' '
)

const logger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
)

export default logger
