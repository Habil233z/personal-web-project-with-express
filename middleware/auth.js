export function isAuthenticated(req, res, next) {
    if (!req.session.user){
        req.flash("error", "Must be logged in first")
        return res.redirect("/login")
    } else {
        next()
    }
}