const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb://fullstack:${password}@ac-gipak0e-shard-00-00.2qhneeq.mongodb.net:27017,ac-gipak0e-shard-00-01.2qhneeq.mongodb.net:27017,ac-gipak0e-shard-00-02.2qhneeq.mongodb.net:27017/?ssl=true&replicaSet=atlas-cxjz06-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster1`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// const person = new Person({
//   content: 'HTML is easy',
//   important: true,
// })

// person.save().then(result => {
//   console.log('contact saved!')
//   mongoose.connection.close()
// })

Person.find({}).then(result => {
  result.forEach(person => {
    console.log(person)
  })
  mongoose.connection.close()
})