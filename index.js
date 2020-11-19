const express = require('express')
const crypto = require('crypto')
// connect db
require('./lib/mongoose')
const User = require('./models/User')

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static('./public'))

let session = null

app.post('/login', async function (req, res) {
  if (session) return res.send('logined')

  const { body: { id, pw } } = req

  const EPW = crypto.createHash('sha512').update(id + 'd!6b&^a' + pw).digest('base64')

  const data = await User.find({ id, pw: EPW })

  if (data.length) {
    session = id
    console.log(session)
    return res.redirect('/')
  }

  res.send('login failed')
})

app.get('/logout', async function (req, res) {
  session = null
  res.redirect('/login.html')
})

app.post('/registry', function (req, res) {
  const { body: { id, pw, name } } = req

  // encryptedPassword
  const EPW = crypto.createHash('sha512').update(id + 'd!6b&^a' + pw).digest('base64')
  User.create({ id, pw: EPW, name })

  res.redirect('/')
})

app.get('/users', async (req, res) => {
  const data = await User.find({ }, { pw: 0, __v: 0 })
  res.json(data)
})

const port = 8000
app.listen(port, () => {7
  console.log(`server is running on port: ${port}`)
})
