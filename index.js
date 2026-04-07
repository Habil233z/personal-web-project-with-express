const express = require('express')
const hbs = require("hbs")

const app = express()
const port = 3000

app.set('view engine', 'hbs')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
