/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const mongoose = require('mongoose')

if (process.argv.length<3){
  console.log('give password as argument')
  process.exit()
}

const password = process.argv[2]

const url = `mongodb+srv://Saplu:${password}@cluster0-veiyg.mongodb.net/people?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4]
})

if (process.argv.length === 5){
  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}

else if (process.argv.length === 3){
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

else {
  console.log('give only password or password and name and number as argument')
  mongoose.connection.close()
}