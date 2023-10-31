
const jwt = require("jsonwebtoken")


const HttpError = require("../model/httpError");

const authentication = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        if (!token) {
            throw new HttpError("Authentication failed", 401);
        }

        const decodedToken = await jwt.verify(token, "this-is-secret-key");

        if (!decodedToken) {
            throw new HttpError("Invalid token", 401);
        }

        req.userData = { userId: decodedToken.userId };
        next();
    } catch (error) {
        next(error); 
    }
}

module.exports = { authentication };
