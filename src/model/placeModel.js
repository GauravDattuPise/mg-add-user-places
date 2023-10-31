
const mongoose = require("mongoose");

// crating place schema

const placeSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    }, 
    userId : {
            type: String    
    } 
},
)

module.exports = mongoose.model("Place", placeSchema);