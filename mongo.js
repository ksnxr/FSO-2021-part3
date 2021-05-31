const mongoose = require('mongoose')

const connect = (password) => {
    const url =
        `mongodb+srv://usdfcw:${password}@cluster0.tkw13.mongodb.net/persons?retryWrites=true&w=majority`
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

    const personSchema = new mongoose.Schema({
        name: String,
        number: String,
    })
    const Person = mongoose.model('Person', personSchema)

    return Person
}

if (process.argv.length == 3) {
    const password = process.argv[2]
    Person = connect(password)

    Person.find({}).then(result => {
        result.forEach(note => {
            console.log(note)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length == 5) {
    const password = process.argv[2]
    const name = process.argv[3]
    const number = process.argv[4]
    Person = connect(password)

    const person = new Person({
        name,
        number,
    })

    person.save().then(result => {
        console.log('note saved!')
        mongoose.connection.close()
    })
} else {
    console.log('Please provide the required format')
    process.exit(1)
}
