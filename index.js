//create and express app stored in the app variable
require('dotenv').config();
const express=require('express')
const app=express()

const Person=require('./models/person')
app.use(express.static('dist'))
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
      id: "1",
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: "2",
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    }
    // { 
    //   "id": "3",
    //   "name": "Dan Abramov", 
    //   "number": "12-43-234345"
    // },
    // { 
    //   "id": "4",
    //   "name": "Mary Poppendieck", 
    //   "number": "39-23-6423122"
    // }
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

// app.get('/api/persons',(request,response)=>{
//     response.json(persons)
// })

app.get('/api/phonebook',(request,response)=>{
    Person.find({}).then(persons=>{
        response.json(persons)
    }).catch(error => {
        response.status(500).json({ error: 'Failed to fetch data from MongoDB' });
      });
})

app.get('/api/phonebook/:id',(request, response)=>{
    const id= request.params.id
    const person=persons.find(person=>person.id===id)
    if (person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/phonebook/:id',(request,response)=>{
    const id=request.params.id
    // 
    Person.findByIdAndDelete(id)
    .then(result=>{
        if (result){
        response.status(204).end();
    } else {
        response.status(404).json({error: 'Not found'})
    }
    })
    .catch(error=>{
        console.log(error);
        response.status(500).json({error:'Failed to delete from MongoDB'})
    })
})

//generate new id number
// const generatedId=()=>{
//     return String(Math.floor(Math.random()*(1000000-5)+5))
// }

app.post('/api/phonebook',(request,response)=>{
    const body=request.body
    const contact=persons.find(person=>person.name===body.name)
    // if (contact){
    //     return response.status(400).json({
    //         error:'name must be unique'
    //     }) 
    // }
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
    const person= new Person({
        name:body.name,
        number:body.number,
    })

    // persons=persons.concat(person)
    // response.json(person)
    person.save().then(savedPerson=>{
        response.json(savedPerson)
    }).catch(error=>{
        response.status(500).json({error: 'Failed to save person to MongoDB'})
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
app.use(unknownEndpoint)
  
const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})