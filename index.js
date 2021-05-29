const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

morgan.token('body', (request, response) => {
    temp = JSON.stringify(request.body)
    if (temp !== JSON.stringify({})) {
        return temp
    } else {
        return ''
    }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    },
    {
        "name": "test",
        "number": "56423122",
        "id": 5
    }
]

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${persons.length} people\n${new Date().toString()}`)
})

app.get('/api/persons', (request, response) => {
    console.log(request.body)
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id != id)

    response.status(204).end()
})

const getRandomInt = max => Math.floor(Math.random() * max)

app.post('/api/persons', (request, response) => {
    const person = request.body
    if (!person.name) {
        return response.status(400).json({ error: 'name must be provided' })
    } else if (!person.number) {
        return response.status(400).json({ error: 'number must be provided' })
    } else if (persons.find(p => p.name === person.name)) {
        return response.status(400).json({ error: 'name must be unique' })
    } else if (persons.find(p => p.number === person.number)) {
        return response.status(400).json({ error: 'number must be unique' })
    }

    let newId = getRandomInt(1000)
    while (persons.find(person => person.id === newId)) {
        newId = getRandomInt(1000)
    }
    person.id = newId
    persons = persons.concat(person)
    console.log(persons)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})