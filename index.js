const express = require('express')
const Person = require('./models/person')
var morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
morgan.token('type', (req) => { JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
app.use(express.static('build'))
app.get('/api/persons', (response) => {
    Person.find({}).then(result => response.json(result))
})
/*app.get('/info', (response) => {
    response.send(`<p>PhoneBook has info for ${persons.length} people</p>
    <p>${new Date}</p>`
    )
})*/
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person)
            response.json(person)
        else
            response.status(404).end
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(() => response.status(204).end())
        .catch(error => next(error))
})
app.post('/api/persons/', (request, response, next) => {
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
    /*  if (persons.filter(persona => persona.name.localeCompare(body.name) === 0).length > 0) {
          return response.status(400).json({
              error: 'name must be unique'
          })
      }*/
    const person = new Person({
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 200)
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    }).catch(error => {
        next(error)
    })
}
)
app.put('/api/persons/:id', (request, response, next) => {
    const person = {
        number: request.body.number
    }
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => response.json(updatedPerson))
        .catch(error => next(error))
})
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }
    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})