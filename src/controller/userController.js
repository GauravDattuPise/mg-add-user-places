const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const HttpError = require("../model/httpError");


exports.registerUser = async (req, res, next) => {
    try {
        const userData = req.body
        const { name, email, password } = userData;

        console.log(name, email, password)// the output of this is undefined undefined undefined

        // user validation
        if (!name) {
            const error = new HttpError("name is required", 400)
            return next(error)           
        }
        if (!email) {
            const error = new HttpError("email is required", 400)
            return next(error)        
        }
        if (!password) {
            const error =  new HttpError("password is required", 400)
            return next(error)        
        }

        // If email already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            // return next(new HttpError("Email Already Registered. Please Login", 400))
            return res.status(200).send({status : false, message : "Email alredy registerd, Please Login"})
        }

        // hashing password
        const hashedPassword = await bcrypt.hash(password, 10);
        userData.password = hashedPassword;

        const registeredUser = await userModel.create(userData);
        return res.status(201).send({ status: true, message: "Registration Successful", user: registeredUser })

    } catch (error) {
        res.status(500).send({ status: false, message: "Error in User Registration", error: error.message });
    }
}

// User Login

exports.loginUser = async (req, res, next) => {
    try {

        const userData = req.body
        const { email, password } = userData;

        // user validation
        if (!email) {
            const error = new HttpError("email is required", 400)
            return next(error)            
        }
        if (!password) {
            const error = new HttpError("password is required", 400)
            return next(error)     
        }

        // If email not exists
        const existingUser = await userModel.findOne({ email });
        if (!existingUser) {
            // throw new HttpError("Email Not Found, Please Register", 404)
            return res.status(200).send({status : false, message : "Email not found, Please Register"})
        }

        // match password
        const matchedPassword = await bcrypt.compare(password, existingUser.password);
        if (!matchedPassword) {
            // throw new HttpError("Email or password is invalid", 200)
            return res.status(200).send({status : false, message : "email or password is wrong"})
        }

        // creating token
        const token = jwt.sign({ userId: existingUser._id }, "this-is-secret-key", { expiresIn: "20m" });

        return res.status(200).send({ status: true, message: "Login Successful", userData : {userId : existingUser._id, token : token} })
    } catch (error) {
        res.status(500).send({ status: false, message: "Error in User Login", error: error.message });
    }
}