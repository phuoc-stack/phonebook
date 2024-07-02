//create and express app stored in the app variable
const express=require('express')
const app=express()

app.use(express.json())
const cors = require('cors')

const morgan = require('morgan')
//allow for requests from all origins
app.use(cors())
app.use(morgan('dev'))

const date_time=new Date()

//activate json parser
let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
//Root path route
app.get('/', (request, response) => {
    response.send('Welcome to the Phonebook API');
  });

app.get('/info',(request,response)=>{
    response.send(`
        <p>Phonebook has info for ${persons.length} people
        </p><p>${date_time.toString()}</p>`)
})

app.get('/api/persons',(request,response)=>{
    response.json(persons)
})

app.get('/api/persons/:id',(request, response)=>{
    const id= request.params.id
    const person=persons.find(person=>person.id===id)
    if (person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id',(request,response)=>{
    const id=request.params.id
    persons=persons.filter(person=>person.id!=id)
    response.status(204).end()
})

//generate new id number
const generatedId=()=>{
    return String(Math.floor(Math.random()*(1000000-5)+5))
}

app.post('/api/persons',(request,response)=>{
    const body=request.body
    const contact=persons.find(person=>person.name===body.name)
    if (contact){
        return response.status(400).json({
            error:'name must be unique'
        }) 
    }
    if (!body.name){
        return response.status(400).json({
            error:'name missing'
        })
    }
    if (!body.number){
        return response.status(400).json({
            error:'number missing'
        })
    }
    const person={
        name:body.name,
        number:body.number,
        id: generatedId()
    }

    persons=persons.concat(person)
    response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
app.use(unknownEndpoint)
  
const PORT = process.env.PORT || 3002

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})