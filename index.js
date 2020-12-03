const express = require('express')
const crypto = require('crypto')
const session = require('express-session')
// const methodOverride = require('method-override')

// connect db
require('./lib/mongoose')

// load models
const User = require('./models/User')
const Post = require('./models/Post')

const app = express()
// app.use(methodOverride('_method'))
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
  res.render('index', { user: req.session.user })
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/posts', async (req, res) => {
  const posts = await Post.find({ })
  res.render('posts', { posts })
})

app.get('/posts/create', (req, res) => {
  if (!req.session.user) return res.redirect('/login')
  return res.render('createPost')
})

app.get('/posts/:postId', async (req, res) => {
  const { params: { postId } } = req
  const post = await Post.findOneAndUpdate({ _id: postId }, { $inc: { hit: 1 } }, { new: true })
  res.render('postDetail', { post, user: req.session.user })
})

app.delete('/posts/:postId', async (req, res) => {
  const { params: { postId } } = req
  await Post.deleteOne({ _id: postId })
  res.redirect('/posts')
})

app.post('/posts', (req, res) => {
  if (!req.session.user) return res.redirect('/login')
  const { body: { title, content } } = req
  Post.create({ title, content, writer: req.session.user._id })
  return res.redirect('/posts')
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
