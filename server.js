const dotenv = require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT

const homeController = require('./controllers/home')
const postsRouter = require('./routers/posts')
const apiRouter = require('./routers/api')
const notfound = require('./middleware/notfound')

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', homeController.index)

app.use('/api', apiRouter)
app.use('/posts', postsRouter)

app.use(notfound)
app.listen(port ?? 3000, () => {
  console.log(`Server running at http://localhost:${port}`)
})