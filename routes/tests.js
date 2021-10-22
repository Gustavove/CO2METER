//Modulo para haces testing

var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override");
    mongoose = require("mongoose");

//Creamos variable route (funciona igual que app)
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

router.get("/", function (req, res) {
    res.send("Hello World!");
});

app.use(router);


//Modulo disponible
module.exports = router;