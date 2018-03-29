var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var exphb = require("express-handlebars");

//scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

//require models
//var db = require("./models");

var PORT = process.env.PORT || 3000;

//initialize express
var app = express();

//express router
var router = express.Router();
app.use(router);

//require routes
require("./config/routes")(router);

//use morgan logger for logging requests
app.use(logger("dev"));

//make public a static dir
app.use(express.static(__dirname + "/public"));

//connect and use handlebars
app.engine("handlebars", exphb({defaultLayout: "main"}));
app.set("view engine", "handlebars");

//use body-parser for handling form submissions
app.use(bodyParser.urlencoded({extended: false}));

//If deployed, use deployed db; otherwise use local mongo db
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

//connect mongoose to db
mongoose.connect(db, function(error) {
    if (error) {
        console.log(error);
    }
    else {
        console.log("mongoose is connected");
    }
});

//listen to app on correct port
app.listen(PORT, function() {
    console.log("Listening on port: " + PORT);
})