require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

morgan.token('body', request => JSON.stringify(request.body))

app.use(express.json())
app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
))
app.use(express.static('dist'))

let persons = []

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })
    .catch(error => {
      console.log(error)
      response.status(400).send({error: 'malformatted id'})
    })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  let person = request.body
  const id = Math.floor(Math.random() * 1000000).toString()
  if (persons.map(p => p.name).includes(person.name)) {
    response
      .status(400)
      .json({error: 'Name must be unique'})
      .end()
  } else if (person.number === ''){
    response
      .status(400)
      .json({error: 'Number field is required'})
      .end()
  } else if (person.name === '') {
    response
      .status(400)
      .json({error: 'Name field is required'})
      .end()
  } else {
    person = {...person, id: id}
    persons = [...persons, person]
    response.json(person)
  }
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})