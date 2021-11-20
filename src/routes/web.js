//Modulo para la web

const express = require('express');

const bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    path = require('path');
    Console = require("console");
    mongoose = require("mongoose");

//Obtener ruta root (no borrar!)
let ruta = __dirname;
ruta = ruta.split('/');
ruta.pop();
ruta.pop();
ruta  = ruta.join('/');

//Creamos variable route (funciona igual que app)
const router = express.Router();

//app.use(express.static("src/public"));

//Permite obtener JSON y formularios en peticiones POST
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(methodOverride());

router.get("/", function (req, res) {
    res.render('index');
    console.log(res);
});

router.get("/mapa", function (req, res) {
    res.render('maps');
    console.log(res);
});

router.get("/pasarValores", function (req, res) {
    res.render('pasarValores', {Title : "Esto es un valor"});
});

// router.get("/", function (req, res) {
//     res.sendFile(path.join(ruta, '/src/views/ejhtml.html'));
// });

//Modulo disponible
module.exports = router;
