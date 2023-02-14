const { response } = require('express')
const express = require('express')
const Person = require('./models/person')
const { request } = require('http')
var morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
morgan.token('type', (req, res) => { JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
console.log(process.env.MONGODB_URI)


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
        "name": "Mary Poppen",
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => response.json(result))
})
app.get('/info', (request, response) => {
    response.send(`<p>PhoneBook has info for ${persons.length} people</p>
    <p>${new Date}</p>`
    )
})
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person=>response.json(person))
})
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(persona => persona.id != id)
    return response.status(204).end()
})
app.post('/api/persons/', (request, response) => {
    const body = request.body
    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }
    if (persons.filter(persona => persona.name.localeCompare(body.name) === 0).length > 0) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = new Person({
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 200)
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
}
)
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})