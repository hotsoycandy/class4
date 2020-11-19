const { Schema, model } = require('mongoose')

const userSchema = Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  pw: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  school: {
    type: String,
    default: '디지텍'
  },
  age: {
    type: Number,
    required: true,
    default: 18
  },
  isMarried: {
    type: Boolean,
    default: false
  },
  isDead: {
    type: Boolean,
    default: false
  }
})

const User = model('user', userSchema)

module.exports = User
