import express from "express"
import { engine } from "express-handlebars"
import multer from "multer"
import { db } from "./config/database.js"
import session from "express-session"

import { getProjects, getProjectsById, createProject, getEditProject, updateProject, deleteProject } from "./src/assets/scripts/project.js"

const storage = multer.memoryStorage()
const upload = multer({ storage: storage})
let dataUri = ""

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/assets", express.static("./src/assets/scripts"))
app.use("/assets", express.static("./src/assets"))
app.use("/views", express.static("./src/views"))

app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: true
}))

app.engine("hbs", engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: "./src/views/layouts",
    partialsDir: "./src/views/partials"
}))

app.set('view engine', 'hbs')
app.set("views", "./src/views")



app.get("/", (req, res) => {
    res.render("home", {
        title: "Home"
    })
})

app.get('/home', (req, res) => {
    res.render("home", {
        title: "Home"
  })
})

app.get("/contact", (req, res) => {
    res.render("contact", {
        title: "Contact"
    })
})

app.get("/my-project", async (req, res) => getProjects(req, res, db, dataUri))
app.post("/my-project", async (req, res) => createProject(req, res, db, dataUri))
app.get("/my-project/:id", async (req, res) => getProjectsById(req, res, db))
app.get("/my-project/edit/:id", async (req, res) => getEditProject(req, res, db))
app.post("/my-project/edit/:id", async (req, res) => updateProject(req, res, db, dataUri))
app.post("/my-project/delete/:id", async (req, res) => deleteProject(req, res, db))

app.get("/contact-me", (req, res) => {
    res.render("contactMe", {
        title: "Contact Me"
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.post("/convert-image", upload.single("image"), (req, res) => {
    try {
        const buffer = req.file.buffer
        const base64String = buffer.toString('base64')
        dataUri = `data:${req.file.mimetype}; base64, ${base64String}`
        req.session.flash = {
            type: "success",
            message: "Img has been Converted. Ready to submit"
        }
        res.redirect("/my-project")

    } catch (error) {
        console.log("error at convert-image")
    }

 })





    