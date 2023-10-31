
const { Router } = require("express");
const { check } = require("express-validator")
const { addPlace, getAllPlaces, deletePlace, getSinglePage, updatePlace } = require("../controller/placeController");
const { authentication } = require("../middleware/chekAuthentication");

const router = Router();

// to get all places
router.get("/getAllPlaces", getAllPlaces);

// to create place
router.post("/addPlace", authentication,
    [
        check("title").not().isEmpty(),
        check("description").isLength({ min: 5 }),
        check("address").not().isEmpty()
    ],
    addPlace);

// get single place
router.get("/getPlace/:placeId", getSinglePage )

// update single place
router.patch("/updatePlace/:placeId",authentication, updatePlace)

// delete place
router.delete("/deletePlace/:placeId",authentication, deletePlace)

module.exports = router


