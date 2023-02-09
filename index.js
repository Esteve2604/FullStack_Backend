const { response } = require('express')
const express = require('express')
const { request } = require('http')
var morgan = require('morgan')
const app = express()
app.use(express.json())
morgan.token('type', (req, res) => { JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
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
    response.json(persons)
})
app.get('/info', (request, response) => {
    response.send(`<p>PhoneBook has info for ${persons.length} people</p>
    <p>${new Date}</p>`
    )
})
app.get('/api/persons/:id', (request, response) => {
    const id=Number(request.params.id)
    const person=persons.find(persona=>persona.id===id)
    if(person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})
app.delete('/api/persons/:id', (request,response)=>{
    const id=Number(request.params.id)
    persons=persons.filter(persona=>persona.id!=id)
    return response.status(204).end()
})
app.post('/api/persons/',(request,response) =>{
    const body=request.body
    if(!body.name){
        return response.status(400).json({ 
            error: 'name missing' 
          })
    }
    if(!body.number){
        return response.status(400).json({ 
            error: 'number missing' 
          })
    }
    if(persons.filter(persona=>persona.name.localeCompare(body.name)===0).length>0){
        return response.status(400).json({ 
            error: 'name must be unique' 
          })
    }
    const person={
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random()*200)
    }
    persons=persons.concat(person)
    response.json(person)
}
)
const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)