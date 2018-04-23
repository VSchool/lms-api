module.exports = {
    isValidAdmin: (req, res, next) => {
        if (req.user.permissions.admin)
            next();
        else
            res.status(403).send({ message: "Admin privileges required" })
    }
}