const express = require('express')
const hbs = require("hbs")

const app = express()
const port = 3000

app.set('view engine', 'hbs')
app.set("views", "./src/views")

hbs.registerPartials("./src/views/partials")

app.use("/assets", express.static("./src/assets"))

app.get('/home', (req, res) => {
  res.render("home")
})

app.get("/contact", (req, res) => {
    res.render("contact")
})

app.get("/my-project", (req, res) => {
    res.render("myProject")
})

app.get("/contact-me", (req, res) => {
    res.render("contactMe")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
