import express from "express"
import { engine } from "express-handlebars"
import { create } from "express-handlebars"

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
                console.log("testing")
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
            img:base64String,
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

app.get("/contact-me", (req, res) => {
    res.render("contactMe", {
        title: "Contact Me"
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//test




    