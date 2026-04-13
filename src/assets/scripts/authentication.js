import bcrypt from 'bcrypt'

export async function register(req, res, db) {
    try {
        const {name, email, password} = req.body

        const saltRounds = 10
        const hashedPassowrd = await bcrypt.hash(password, saltRounds)

        const query = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING*"
        const values = [name, email, hashedPassowrd]
        const result = await db.query(query, values)

        req.flash("success", "Register Successfull")

        console.log(("User created", result.rows[0]))
        res.redirect("/login")
    } catch (error) {
        console.log(error)
    }
}

export async function login(req, res, db) {
    try {
        const {email, password} = req.body

        const query = "SELECT * FROM users WHERE email = $1"
        const result = await db.query(query, [email])
        if (result.rows.length === 0) {
            req.flash("error", "Invalid email or password")
            return res.redirect("/login")
        }
        const user = result.rows[0]
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            req.flash("error", "Invalid email or password")
            return res.redirect("/login")
        } else {
            req.session.user = {
                user: user.id,
                name: user.name,
                email: user.email
            }

            req.flash("success", "Login successfull")

            console.log("User Login:", result.rows[0])
            res.redirect("/home")
        }


    } catch (error) {
        console.log(error)
    }
}

