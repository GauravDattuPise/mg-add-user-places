

const { validationResult } = require("express-validator")
const placeModel = require("../model/placeModel");
const HttpError = require("../model/httpError");

exports.addPlace = async (req, res, next) => {

    try {

        // error handling using express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new HttpError("invalid inputs passed, please check your all fields"), 422);
        }

        const placeData = req.body
        const { title, description, address, userId } = placeData;

        // place validation
        if (!title) {
            const error = new HttpError("title is required", 400)
            return next(error)
        }
        if (!description) {
            return next(new HttpError("description is required", 400))
        }
        if (!address) {
            return next(new HttpError("address is required", 400))
        }
       
        placeData.userId = req.userData.userId
        const createdPlace = await placeModel.create(placeData);
        return res.status(201).send({ status: true, message: "place created Successfully", place: createdPlace })

    } catch (error) {
        res.status(500).send({ status: false, message: "Error in  place creation", error: error.message });
    }
}


exports.getAllPlaces = async (req, res) => {
    try {
        const places = await placeModel.find();
        return res.status(201).send({ status: true, message: "all places", places })
    } catch (error) {
        res.status(500).send({ status: false, message: "Error in get all places", error: error.message });

    }
}

exports.deletePlace = async (req, res) => {
    try {

        const { placeId } = req.params;
        await placeModel.findByIdAndDelete(placeId);
        return res.status(200).send({ status: true, message: "place deleted successfully" })

    } catch (error) {
        res.status(500).send({ status: false, message: "error in delete place", error: error.message });
    }
}

exports.getSinglePage = async (req, res) => {
    try {
        const { placeId } = req.params;

        const placeData = await placeModel.findById(placeId);
        return res.status(200).send({ status: false, message: "place fectched successfully", placeData })

    } catch (error) {
        res.status(500).send({ status: false, message: "error in get single place", error: error.message });
    }
}



exports.updatePlace = async (req,res) => {
    try {
        const { placeId } = req.params;
        const {title, description, address} = req.body
        console.log(placeId, title)

        const placeData = await placeModel.findByIdAndUpdate(placeId, {title : title, description : description, address : address}, {new : true});
        return res.status(200).send({ status: true, message: "place updated successfully", placeData })

    } catch (error) {
        res.status(500).send({ status: false, message: "error in updating single place", error: error.message });
    }
}