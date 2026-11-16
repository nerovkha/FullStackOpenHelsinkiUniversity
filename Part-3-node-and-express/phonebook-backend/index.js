import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import Person from './models/person.js'
import logger from './utils/logger.js'

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(logger)

const connectToDatabase = async () => {
  let uri = process.env.MONGODB_URI

  if (!uri) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('MONGODB_URI must be set in production')
    }

    const memoryServer = await MongoMemoryServer.create()
    uri = memoryServer.getUri('phonebook')
    console.log('no MONGODB_URI configured, using an in-memory database')
  }

  await mongoose.connect(uri)
  console.log('connected to', process.env.MONGODB_URI ? 'MongoDB' : 'in-memory MongoDB')
}

app.get('/info', async (request, response) => {
  const count = await Person.countDocuments()
  response.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${new Date()}</p>
  `)
})

app.get('/api/persons', async (request, response) => {
  const persons = await Person.find({})
  response.json(persons)
})

app.get('/api/persons/:id', async (request, response, next) => {
  try {
    const person = await Person.findById(request.params.id)

    if (person) {
      response.json(person)
    } else {
      response.status(404).send({ error: 'person not found' })
    }
  } catch (error) {
    next(error)
  }
})

app.delete('/api/persons/:id', async (request, response, next) => {
  try {
    await Person.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.post('/api/persons', async (request, response, next) => {
  const { name, number } = request.body

  const existing = await Person.findOne({ name })
  if (existing) {
    return response.status(409).json({ error: 'name must be unique' })
  }

  const person = new Person({ name, number })

  try {
    const saved = await person.save()
    response.status(201).json(saved)
  } catch (error) {
    next(error)
  }
})

app.put('/api/persons/:id', async (request, response, next) => {
  const { name, number } = request.body

  try {
    const updated = await Person.findByIdAndUpdate(
      request.params.id,
      { name, number },
      { new: true, runValidators: true, context: 'query' }
    )

    if (updated) {
      response.json(updated)
    } else {
      response.status(404).send({ error: 'person not found' })
    }
  } catch (error) {
    next(error)
  }
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Phonebook server running on port ${PORT}`)
  })
}

start()
