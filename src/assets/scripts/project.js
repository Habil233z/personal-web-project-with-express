import fs from 'fs'

export async function getProjects(req, res, db, dataUri) {
    const query = "SELECT * FROM projects ORDER BY id ASC"
    const result = await db.query(query)

    console.log(result.rows)

    res.render("myProject", {
        projects: result.rows, 
        title: "My Project",
        dataUri:dataUri
    })
}

export async function getProjectsById(req, res, db) {
    try {
    const { id } = req.params

    const query = "SELECT * FROM projects WHERE id = $1"
    const result = await db.query(query, [id])

    if (result.rows.length === 0) {
        return res.send("Project not found")
    }
    console.log(result.rows[0])
    res.render("projectDetail", {
        title: "Project Detail", 
        project: result.rows[0]})
    } catch (error) {
        console.log("Error fetching Project", error)
        res.send("Server Error")
    }
}

export async function createProject(req, res, db) {
    try {
        const {name, description, tag} = req.body
        const img = req.file ? req.file.filename : null

        const author_id = req.session.user.user
        if (name.length === 0) {
        req.flash("error", "Project must have a name")
        res.redirect("/my-project")
        }
        if (description.length === 0) {
        req.flash("error", "Project must have a descriptiom")
        res.redirect("/my-project")
        }
        if (tag === "none") {
        req.flash("error", "Project must have a tag")
        res.redirect("/my-project")
        }
        
        else {
        const query = "INSERT INTO projects (name, description, tag, author_id, img) VALUES ($1, $2, $3, $4, $5) RETURNING*"
        const values = [name, description, tag, author_id, img]
        const result = await db.query(query, values)

        req.flash("success", "Project successfully added")

        res.redirect("/my-project")
        }

    } catch (error) {
        req.flash("error", "Register Successfull")

        console.log("Error fetching Project", error)
        res.send("Server Error")
    }
}

export async function getEditProject(req, res, db) {
    try {
    const { id } = req.params
    const userId = req.session.user.user

    const query = "SELECT * FROM projects WHERE id = $1 AND author_id = $2"
    const result = await db.query(query, [id, userId])

    if (result.rows.length === 0) {
            req.flash("error", "You didn't have access to edit this project")
            return res.redirect("/my-project")
        }
    res.render("projectEdit", {
        title: "Project Detail", 
        project: result.rows[0],})
    } catch (error) {
        console.log("Error fetching Project", error)
        res.send("Server Error")
    }
}

export async function updateProject(req, res, db) {
    try {
    const { id } = req.params
    const {name, description, tag} = req.body
    const userId = req.session.user.user
    const img = req.file ? req.file.filename : null
    
    if (req.file) {
        if (name.length === 0) {
        req.flash("error", "Project must have a name")
        res.redirect(`/my-project/edit/${id}`)
        }
        if (description.length === 0) {
        req.flash("error", "Project must have a description")
        res.redirect(`/my-project/edit/${id}`)
        }
        if (tag === "none") {
        req.flash("error", "Project must have a tag")
        res.redirect(`/my-project/edit/${id}`)
        } else {
        const query = `
        UPDATE projects
        SET name = $1, description = $2, tag = $3, img = $4
        WHERE id = $5 AND author_id = $6
        RETURNING *
        `
        const values = [name, description, tag, img, id, userId]
        const result = await db.query(query, values)

        if (result.rows.length === 0) {
            req.flash("error", "You didn't have access to edit this project")
            return res.redirect("/my-project")
        }

        req.flash("success", "Project has been edited")

        console.log("Project updated:", result.rows[0])
        res.redirect("/my-project")
        }
    } else if (name.length === 0) {
        req.flash("error", "Project must have a name")
        res.redirect(`/my-project/edit/${id}`)
        }
        if (description.length === 0) {
        req.flash("error", "Project must have a description")
        res.redirect(`/my-project/edit/${id}`)
        }
        if (tag === "none") {
        req.flash("error", "Project must have a tag")
        res.redirect(`/my-project/edit/${id}`)
        } else {
        const query = `
        UPDATE projects
        SET name = $1, description = $2, tag = $3
        WHERE id = $4 AND author_id = $5
        RETURNING *
        `
        const values = [name, description, tag, id, userId]
        const result = await db.query(query, values)

        if (result.rows.length === 0) {
            req.flash("error", "You didn't have access to edit this project")
            return res.redirect("/my-project")
        }

        req.flash("success", "Project has been edited")

        console.log("Project updated:", result.rows[0])
        res.redirect("/my-project")
        }
    


    } catch (error) {
        req.flash("error", "Experience error")
        console.log("Error fetching Project", error)
        res.send("Server Error")
    }
}

export async function deleteProject(req, res, db) {
    try{
    const {id} = req.params
    const userId = req.session.user.user

    const selectQuery = "SELECT * FROM projects WHERE id = $1 AND author_id = $2"
    const result = await db.query(selectQuery, [id, userId])

    if (result.rows.length === 0) {
        req.flash("error", "You didn't have access to delete this project")
        return res.redirect("/my-project")
    }
    const project = result.rows[0]

    if (project.img) {
        const imagePath = `./public/uploads/${project.img}`

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath)
            console.log("Image deleted" + project.img)
        }
    }

    const deleteQuery = "DELETE FROM projects WHERE id = $1 AND author_id = $2"
    await db.query(deleteQuery, [id, userId])

    req.flash("success", "Project successfully deleted")
    res.redirect("/my-project")
    
    } catch (error){
        req.flash("error", "Error at deleting project or project isn't exist")
        console.log("error")
    }
}

