const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

morgan.token('body', function (req, res) {return JSON.stringify(req.body)})
app.use(express.json())
app.use(express.static('build'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]

app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
        res.json(people.map(person => person.toJSON()))
    })
})

app.get('/info', (req, res) => {
    const info = `Phonebook has info for ${persons.length} people`
    const time = new Date()
    res.send(`<p>${info}</p><p>${time}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if(person){
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    console.log(req.body)
    const body = req.body
    if (!body.name) {
        console.log('Name missing error')
        return Response.status(400).json({
            error: 'Name needed'
        })
    }
    if (!body.number) {
        console.log('Number missing error')
        return Response.status(400).json({
            error: 'Number needed'
        })
    }
    if (persons.map(p => p.name).includes(body.name)){
        console.log('Name exists error')
        return Response.status(409).json({
            error: 'Name already exists'
        })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    console.log(person)
    persons = persons.concat(person)
    res.json(person)
})

const generateId = () => {
    return Math.floor(Math.random() * 9999999)
}

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})