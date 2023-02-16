const peopleRouter = require('express').Router()
const Person = require('./models/person')
peopleRouter.get('/', (response) => {
    Person.find({}).then(result => response.json(result))
})
/*peopleRouter.get('/info', (response) => {
    response.send(`<p>PhoneBook has info for ${persons.length} people</p>
    <p>${new Date}</p>`
    )
})*/
peopleRouter.get('/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person)
            response.json(person)
        else
            response.status(404).end
    }).catch(error => next(error))
})

peopleRouter.delete('/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(() => response.status(204).end())
        .catch(error => next(error))
})
peopleRouter.post('/', (request, response, next) => {
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
peopleRouter.put('/:id', (request, response, next) => {
    const person = {
        number: request.body.number
    }
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => response.json(updatedPerson))
        .catch(error => next(error))
})
module.exports = peopleRouter