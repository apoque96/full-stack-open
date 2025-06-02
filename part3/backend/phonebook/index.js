require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

console.log('Incorrect arguments: expected "Password", "Name", "Number"')

morgan.token('content', (req) => JSON.stringify(req.body))

app.use(express.json())
app.use(morgan('tiny'))
app.use(morgan(':content'))
app.use(express.static('dist'))

const generateId = () => {
  return String(Math.floor(Math.random() * 10000000000))
}

app.get('/info', (_req, res) => {
  const now = new Date()
  Person.find({}).then((result) =>
    res.send(
      `<p>Phonebook has info for ${result.length} people</p><p>${now}</p>`
    )
  )
})

app.get('/api/persons', (_req, res) => {
  Person.find({}).then((persons) => res.json(persons))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      person ? res.json(person) : res.status(404).end()
    })
    .catch((err) => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name) res.status(400).json({ error: 'Missing person name' })
  else if (!body.number)
    res.status(400).json({ error: 'Missing person number' })

  const person = new Person({
    name: body.name,
    number: body.number,
    id: generateId(),
  })

  person
    .save()
    .then((savedPerson) => res.json(savedPerson))
    .catch((err) => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        const { name, number } = req.body

        if (!name) res.status(400).json({ error: 'Missing person name' })
        else if (!number)
          res.status(400).json({ error: 'Missing person number' })

        person.name = name
        person.number = number

        return person.save().then((updatedPerson) => res.json(updatedPerson))
      } else res.status(404).end()
    })
    .catch((err) => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => next(err))
})

const unkownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unkown endpoint' })
}

app.use(unkownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError')
    return res.status(400).send({ error: 'malformatted id' })
  else if (error.name === 'ValidationError')
    return res.status(400).json({ error: error.message })

  next(error)
}

app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
