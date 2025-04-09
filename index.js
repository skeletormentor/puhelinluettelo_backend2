const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('body', request => JSON.stringify(request.body))

app.use(express.json())
app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
))
app.use(cors())
app.use(express.static('dist'))

let persons = [
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": "1"
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": "2"
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": "3"
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": "4"
      },
      {
        "name": "Valtteri Arino",
        "number": "0456312129",
        "id": "5"
      }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${Date()}</p>
  `)
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})