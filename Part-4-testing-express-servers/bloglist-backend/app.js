import express from 'express'
import cors from 'cors'
import blogsRouter from './controllers/blogs.js'
import usersRouter from './controllers/users.js'
import loginRouter from './controllers/login.js'
import tokenExtractor from './middleware/tokenExtractor.js'
import errorHandler from './middleware/errorHandler.js'
import Blog from './models/blog.js'
import User from './models/user.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = express.Router()
  testingRouter.post('/reset', async (request, response) => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    response.status(204).end()
  })
  app.use('/api/testing', testingRouter)
}

app.use(errorHandler)

export default app
