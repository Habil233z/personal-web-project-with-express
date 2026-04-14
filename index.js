import express from "express"
import { engine } from "express-handlebars"
import { db } from "./config/database.js"
import session from "express-session"
import flash from "express-flash"

import { getProjects, getProjectsById, createProject, getEditProject, updateProject, deleteProject } from "./src/assets/scripts/project.js"
import { login, register } from "./src/assets/scripts/authentication.js"
import { isAuthenticated } from "./middleware/auth.js"
import upload from "./middleware/multer.js"
import { handleUploadError } from "./middleware/uploadErrorHandler.js"

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(session({
    secret: "my-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly:true
    }
}))

app.use(flash())

app.use((req, res, next) => {
    res.locals.user = req.session.user || null
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})

app.use("/assets", express.static("./src/assets/scripts"))
app.use("/assets", express.static("./src/assets"))
app.use("/views", express.static("./src/views"))
app.use(express.static("public"))

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

app.get("/my-project", async (req, res) => getProjects(req, res, db))
app.post("/my-project", isAuthenticated, handleUploadError(upload.single("image")), async (req, res) => createProject(req, res, db))
app.get("/my-project/:id", async (req, res) => getProjectsById(req, res, db))
app.get("/my-project/edit/:id", isAuthenticated, async (req, res) => getEditProject(req, res, db))
app.post("/my-project/edit/:id", isAuthenticated, handleUploadError(upload.single("image")),async (req, res) => updateProject(req, res, db))
app.post("/my-project/delete/:id", isAuthenticated, async (req, res) => deleteProject(req, res, db))

app.get("/login", async (req, res) => {
    res.render("login", {
    title: "Login page"
    })
})
app.post("/login", async (req, res) => login(req, res, db))

app.get("/register", async (req, res) => {
    res.render("register", {
    title: "Register page",
    })
})
app.post("/register", async (req, res) => register(req, res, db))

app.get("/contact-me", (req, res) => {
    res.render("contactMe", {
        title: "Contact Me"
    })
})

app.get('/logout', (req, res) => {
    try {
    req.session.destroy()
    res.redirect("/home")
    } catch (error) {
        req.flash("error", "error during logout")
        console.log(error)
    }
    })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})





    