const mongoose = require('mongoose')

// if (process.argv.length<5) {
//   console.log('give password, name and number as argument')
//   process.exit(1)
// }

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4]

const url =`mongodb://fullstack:${password}@ac-gipak0e-shard-00-00.2qhneeq.mongodb.net:27017,ac-gipak0e-shard-00-01.2qhneeq.mongodb.net:27017,ac-gipak0e-shard-00-02.2qhneeq.mongodb.net:27017/?ssl=true&replicaSet=atlas-cxjz06-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster1`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)
// if (process.argv.length==2) {
  Person.find().then(result=>{
    result.forEach(person=>{
      console.log(`phonebook:\n ${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
// }
// const person = new Person({
//   name,
//   number,
// })

// person.save().then(result => {
//   console.log(`added ${name} number ${number} to phonebook`)
//   mongoose.connection.close()
// })