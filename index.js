// const express = require("express")
// const cors = require("cors")
// const mongoose = require("mongoose")
// const multer = require("multer")
// const path = require("path")
// // const dotenv = require("dotenv");
// const HttpError = require("./src/model/httpError");
// // dotenv.config();


// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({extended : false}))

// app.use(cors({
//     origin: "*",
//     methods: ["GET", "POST", "PATCH", "DELETE"],
//     allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization"
// }));

// // connecting to mongodb
// mongoose.connect("mongodb+srv://gauravpise87:Gaurav2001@gauravdb.crgpvot.mongodb.net/add-user-places") 
//     .then(() => console.log("DB is connected"))
//     .catch((err) => console.log("error in connection", err));

// // user routes
// app.use("/user", require("./src/route/userRoute"))

// // place routes
// app.use("/place", require("./src/route/placeRoute"))

// app.use(express.static(path.join(__dirname, "../client/build")));

// app.get("*", function (req, res) {
//   res.sendFile(path.join(__dirname, "../client/build/index.html"))
// });
 

// // route not found
// app.use((err,req,res)=>{
//     const error = new HttpError("could not found path", 404);
//     throw error;
// })

// // global middleware to handle errors
// app.use((error, req, res, next) => {
       
//     if(res.headerSent){
//         return next(error)
//     } 

//     res.status(error.code || 500)
//     res.send({ message : error.message || "An unknown error occured"})
// })

// const port = process.env.PORT || 5000

// app.listen(port, () => {
//     console.log("Server is running on", port);
// })


const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const HttpError = require("./src/model/httpError");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS configuration
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
}));

// Connecting to MongoDB
mongoose
  .connect("mongodb+srv://gauravpise87:Gaurav2001@gauravdb.crgpvot.mongodb.net/add-user-places", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB is connected"))
  .catch((err) => console.error("Error in connection", err));

// User routes
app.use("/user", require("./src/route/userRoute"));

// Place routes
app.use("/place", require("./src/route/placeRoute"));

// Serve static files
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// Handle route not found
app.use((req, res, next) => {
  const error = new HttpError("Could not find path", 404);
  next(error);
});

// Global error handling middleware
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  res.status(error.code || 500).json({ message: error.message || "An unknown error occurred" });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Server is running on", port);
});
