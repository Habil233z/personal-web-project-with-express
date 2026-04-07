import express from "express"
import { engine } from "express-handlebars"

const app = express()
const port = 3000

app.engine("hbs", engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: "./src/views/layouts",
    partialsDir: "./src/views/partials"
}))

app.set('view engine', 'hbs')
app.set("views", "./src/views")

app.use("/assets", express.static("./src/assets"))

app.get("/", (req, res) => {
    res.render("home")
})

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
