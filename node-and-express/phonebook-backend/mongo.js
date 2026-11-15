import 'dotenv/config'
import mongoose from 'mongoose'
import Person from './models/person.js'

const connect = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
}

const main = async () => {
  if (process.argv.length < 3) {
    console.log('usage: node mongo.js <name> <number>')
    console.log('       node mongo.js <id>')
    process.exit(1)
  }

  await connect()

  if (process.argv.length === 3) {
    const person = await Person.findById(process.argv[2])
    console.log(person ? `${person.name} ${person.number}` : 'not found')
  } else {
    const person = new Person({
      name: process.argv[2],
      number: process.argv[3],
    })
    const saved = await person.save()
    console.log(`saved ${saved.name} number ${saved.number} to the phonebook`)
  }

  await mongoose.connection.close()
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
