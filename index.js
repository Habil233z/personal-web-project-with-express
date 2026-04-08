import express from "express"
import { engine } from "express-handlebars"
import multer from "multer"

const storage = multer.memoryStorage()
const upload = multer({ storage: storage})
let dataUri = ""

const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/assets", express.static("./src/assets/scripts"))

app.engine("hbs", engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: "./src/views/layouts",
    partialsDir: "./src/views/partials"
}))

let base64String = "";
            function imageUploaded() {
            let file = document.querySelector(
                'input[type=file]')['files'][0];

            let reader = new FileReader();

            reader.onload = function () {
                base64String = reader.result

                imageBase64Stringsep = base64String;

                console.log(base64String);
            }
            reader.readAsDataURL(file);
        }
//dummy data
//const projects = [
//    { name: "Test 1", description: "1234567890", tag: "Tecnology"},
//    { name: "Test 2", description: "0987654321", tag: "Sport"}
////    ]
let projects = []
let projectsId = 1

//function getProjects() {
//    return new Promise((resolve, reject) => {
//        setTimeout(() => {
//            resolve(projects)
//        }, 500)
//    })
//}

app.set('view engine', 'hbs')
app.set("views", "./src/views")

app.use("/assets", express.static("./src/assets"))

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

app.get("/my-project", async (req, res) => {
    try {
        res.render("myProject", {
            projects: projects,
            imgUpload: '<input type="file" name="img" id="fileId" onchange="imageUploaded()"></input>',
            title: "My Project",
        })
    } catch (error) {
        console.error("error");
    }
    })

app.post("/my-project", async (req, res) => {
    try{
        const {name, description, tag, img} = req.body
       
        const newProject = {
            id:projectsId++,
            name,
            description,
            tag,
            img:dataUri,
        }
        await new Promise(resolve => setTimeout(resolve, 500))
        projects.push(newProject)
        console.log(newProject)
        console.log()
        res.redirect("/my-project")
    } catch {
        console.log("error")
    }

})

app.get("/my-project/:id", async (req, res) => {
    try{
        const {id} = req.params
        const projectsId = parseInt(id)
        const project = projects.find(p => p.id === projectsId)

        if(!project) {
            return res.send("Project not found")
        }
        res.render("projectDetail", {project})
    } catch (error){
        console.log("error")
    }
})

app.get("/my-project/edit/:id", async (req, res) => {
    try{
        const {id} = req.params
        const projectsId = parseInt(id)
        const project = projects.find(p => p.id === projectsId)

        if(!project) {
            return res.send("Project not found")
        }
        res.render("projectEdit", {project})
    } catch (error){
        console.log("error")
    }
})

app.post("/my-project/edit/:id", async (req, res) => {
    try{
        const {id} = req.params
        const projectsId = parseInt(id)
        const {name, description, tag, img} = req.body
        
        const index = projects.findIndex(p => p.id === projectsId)
        console.log(index)
        if(index === -1) {
            return res.send("Project not found")
        }
        projects[index] = {
            id: projectsId,
            name,
            description,
            tag,
            img:dataUri
        }
        console.log("project updated")
        res.redirect(`/my-project/${projectsId}`)

    } catch (error){
        console.log("error")
    }
})

app.post("/my-project/delete/:id", async (req, res) => {
    try{

        const {id} = req.params
        const projectsId = parseInt(id)
        const project = projects.find(p => p.id === projectsId)

        if(!projects) {
            return res.send("Project not found")
        }
        projects = projects.filter(p => p.id !== projectsId)
        console.log(`project with id:${projectsId} has been deleted`)
        
        res.redirect("/my-project")
    } catch (error){
        console.log("error")
    }
})

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

        res.status(200)
    } catch (error) {
        console.log("error at convert-image")
    }

})
//test




    