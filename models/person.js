require('dotenv').config()
var uniqueValidator = require('mongoose-unique-validator');

const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    name:{
      type: String, required: true, unique: true
    },
    number: {
      type: Number, required: true
    }
})
noteSchema.plugin(uniqueValidator);
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
module.exports = mongoose.model('person', noteSchema)