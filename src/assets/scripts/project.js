export async function getProjects(req, res, db) {
    const query = "SELECT * FROM projects ORDER BY id ASC"
    const result = await db.query(query)

    console.log(result.rows)

    const flash = req.session.flash
    delete req.session.flash

    res.render("myProject", {
        projects: result.rows, 
        title: "My Project",
        flash
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
    res.render("projectDetail", {
        title: "Project Detail", 
        project: result.rows[0]})
    } catch (error) {
        console.log("Error fetching Project", error)
        res.send("Server Error")
    }
}

export async function createProject(req, res, db, dataUri) {
    try {
        const {name, description, tag} = req.body
        const img = dataUri

        const query = "INSERT INTO projects (name, description, tag, img) VALUES ($1, $2, $3, $4) RETURNING*"
        const values = [name, description, tag, img]
        const result = await db.query(query, values)

        req.session.flash = {
            type: "success",
            message: "Project successfully added"
        }

        console.log(result.rows[0])
        res.redirect("/my-project")

    } catch (error) {
        req.session.flash = {
            type: "danger",
            message: "Error has happend"
        }

        console.log("Error fetching Project", error)
        res.send("Server Error")
    }
}

export async function getEditProject(req, res, db) {
    try {
    const { id } = req.params

    const query = "SELECT * FROM projects WHERE id = $1"
    const result = await db.query(query, [id])

    if (result.rows.length === 0) {
        return res.send("Project not found")
    }
    res.render("projectEdit", {
        title: "Project Detail", 
        project: result.rows[0]})
    } catch (error) {
        console.log("Error fetching Project", error)
        res.send("Server Error")
    }
}

export async function updateProject(req, res, db) {
    try {
    const { id } = req.params
    const {name, description, tag,} = req.body
    const img = image
    const query = `
        UPDATE projects
        SET name = $1, description = $2, tag = $3, img = $4
        WHERE id = $5
        RETURNING *
        `
    const values = [name, description, tag, img, id]
    const result = await db.query(query, values)

    if (result.rows.length === 0) {
        return res.send("Project not found")
    }

    req.session.flash = {
            type: "success",
            message: "Project successfully edited"
        }

    console.log("Project updated:", result.rows[0])
    res.redirect("/my-project")
    } catch (error) {
        req.session.flash = {
            type: "danger",
            message: "Encounter error when edit this project"
        }
        console.log("Error fetching Project", error)
        res.send("Server Error")
    }
}

export async function deleteProject(req, res, db) {
    try{
    const {id} = req.params
    const query = "DELETE FROM projects WHERE id = $1"
    const result = await db.query(query, [id])

    req.session.flash = {
        type: "success",
        message: "Project successfully Deleted"
    }

    res.redirect("/my-project")

    } catch (error){
        req.session.flash = {
            type: "danger",
            message: "Delete project isnt working"
        }
        console.log("error")
    }
}

