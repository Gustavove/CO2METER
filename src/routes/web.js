//Modulo para la web

const express = require('express');

const methodOverride = require("method-override"),
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
router.use(express.urlencoded({extended: false }));
router.use(express.json());
//Permite hacer PUT y DELETE
router.use(methodOverride());

router.get("/", function (req, res) {
    res.render('menu');
    console.log(res);
});

router.get("/consulta_mapa", function (req, res) {
    res.render('consulta_mapa');
    console.log(res);
});

router.get("/consulta_placa", function (req, res) {

    //Conectar con la base de datos
    mongoose.connect("mongodb://localhost:27017/testpti", {useNewUrlParser: true});
    //Import informe model
    let Informe = require('../models/informe_model.js');

    let id = 67890;

    Informe.find({id_placa: id}, function(err, informes){
        if(err){
            console.log(err);
            res.send(500);
        }
        else{
            let co2 = informes[informes.length-1].datos_co2;
            console.log(informes);
            res.status(200).render('consulta_placa', {dato_co2: co2});
        }
    });
});

router.get("/informes_placa", function (req, res) {
    res.render('informes_placa');
    console.log(res);
});

router.get("/consulta_placas", function (req, res) {
    res.render('consulta_placas');
    console.log(res);
});

router.get("/busqueda_custom", function (req, res) {
    res.render('busqueda_custom');
    console.log(res);
});

router.get("/busqueda_custom2", function (req, res) {
    res.render('busqueda_custom2');
    console.log(res);
});



router.get("/localizaciones", function (req, res) {
    res.render('todas_localizaciones');
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
