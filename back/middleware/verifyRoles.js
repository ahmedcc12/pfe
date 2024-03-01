const verifyRoles = (allowedRole) => {
    return (req, res, next) => {
        if (!req?.role) return res.sendStatus(401);
        if (req.role.toLowerCase() !== allowedRole.toLowerCase()) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles;
