const express = require('express')
const crypto = require('crypto')
const session = require('express-session')

// connect db
require('./lib/mongoose')
const User = require('./models/User')

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static('./public'))
app.set('view engine', 'ejs')
app.use(session({
  secret: '($*YA)*@#12asd^%#',
  resave: false,
  saveUninitialized: true
}))

app.get('/', (req, res) => {
  console.log(req.session.user)
  res.render('index', { user: req.session.user })
})

app.get('/posts', (req, res) => {
  res.render('posts')
})

app.post('/login', async function (req, res) {
  const { body: { id, pw } } = req

  const EPW = crypto.createHash('sha512').update(id + 'd!6b&^a' + pw).digest('base64')

  const data = await User.findOne({ id, pw: EPW })

  if (data) {
    req.session.user = data
    return res.redirect('/')
  }

  res.send('login failed')
})

app.get('/logout', async function (req, res) {
  delete req.session.user
  res.redirect('/')
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
app.listen(port, () => {
  console.log(`server is running on port: ${port}`)
})
