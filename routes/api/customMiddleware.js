function adminsOnly(req, res, next) {
    if (!req.user.admin) {
        return res.status(403).send({ message: "Admin authorization required" })
    }
    next();
}

function studentsOnly(req, res, next) {
    if (req.user.admin) {
        return res.status(403).send({ message: "User must be a student" });
    }
    next();
}

module.exports = {
    adminsOnly,
    studentsOnly
}