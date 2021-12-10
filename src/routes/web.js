//Modulo para la web

const express = require('express');

const methodOverride = require("method-override"),
    mongoose = require("mongoose");
const Informe = require("../models/informe_model.js");

//Obtener ruta root (no borrar!)
let ruta = __dirname;
ruta = ruta.split('/');
ruta.pop();
ruta.pop();
ruta  = ruta.join('/');

//Creamos variable route (funciona igual que app)
const router = express.Router();

var bodyParser = require('body-parser');
const Empresa = require("../models/empresa_model.js");
const { MongoClient, ObjectID } = require('mongodb');


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

    // //Conectar con la base de datos
    mongoose.connect("mongodb://localhost:27017/testpti", {useNewUrlParser: true});

    // //Import empresa model
    let Empresa = require('../models/empresa_model.js');

    Empresa.find( function(err, empresas){
        if(err){
            console.log(err);
            res.send(500);
        }
        else{
            res.status(200).render('consulta_mapa', {empresas: empresas});
            console.log(res);
        }
    });
});

router.get("/consulta_placa", function (req, res) {

    //Conectar con la base de datos
    mongoose.connect("mongodb://localhost:27017/testpti", {useNewUrlParser: true});

    //Import informe model
    let Informe = require('../models/informe_model.js');

    let id = req.query.id;

    Informe.find({id_placa: id}, function(err, informes){
        if(err){
            console.log(err);
            res.send(500);
        }
        else{
            //cogemos el ultimo dato, el mas actual
            let co2 = informes[informes.length-1].datos_co2;
            let fecha = informes[informes.length-1].fecha_transaccion;
            let hora = informes[informes.length-1].hora_transaccion;
            let hash = informes[informes.length-1].hash_transaccion;
            let poblacion = informes[0].nombre_poblacion;
            let nombre_loc = informes[0].nombre_localizacion;
            let longitud = informes[0].coordenadas_longitud_placa;
            let latitud = informes[0].coordenadas_latitud_placa;

            res.status(200).render('consulta_placa', {id_placa: id, dato_co2: co2, fecha: fecha,
                hora: hora, hash: hash, poblacion: poblacion, nombre: nombre_loc, longitud: longitud, latitud: latitud});
        }
    });
});

router.get("/informes_placa", function (req, res) {

    //Conectar con la base de datos
    mongoose.connect("mongodb://localhost:27017/testpti", {useNewUrlParser: true});

    //Import informe model
    let Informe = require('../models/informe_model.js');

    let id = req.query.id;

    Informe.find({id_placa: id}, function(err, informes){
        if(err){
            console.log(err);
            res.send(500);
        }
        else {
            let nombre = informes[0].nombre_localizacion;

            res.render('informes_placa', {informes: informes, nombre: nombre});
            console.log(res);
        }
    });
});

router.get("/consulta_placas", function (req, res) {

    //Conectar con la base de datos
    mongoose.connect("mongodb://localhost:27017/testpti", {useNewUrlParser: true});

    //Import informe model
    let Informe = require('../models/informe_model.js');

    Informe.find( function(err, informes){
        if(err){
            console.log(err);
            res.send(500);
        }
        else{
            res.status(200).render('consulta_placas', {informes: informes});
            console.log(res);
        }
    });
});


router.post("/busqueda_custom", function (req, res) {

    //Conectar con la base de datos
    mongoose.connect("mongodb://localhost:27017/testpti", {useNewUrlParser: true});

    //Import informe model
    let Informe = require('../models/informe_model.js');

    // let filter_1 = req.body
    var filter_1 = req.body.nombre_empresa;
    console.log(filter_1 + " filtro ")
    //var filter_2 = req.body.poblacion;

    if(req.getParameter("filter_1").equals("poblacion") ) {
        Informe.find({nombre_poblacion: req.getParameter("search_1")}, function(err, informes){
            if(err){
                console.log(err);
            }
            else{
                res.render('busqueda_custom_res', {informes: informes});
                res.status(200).jsonp(informes);
            }
        });
    }
    else if(req.getParameter("filter_1").equals("nombre_empresa") ) {
        Informe.find({nombre_localizacion: req.getParameter("search_1")}, function(err, informes){
            if(err){
                console.log(err);
            }
            else{
                res.render('busqueda_custom_res',{informes: informes});
                res.status(200).jsonp(informes);
            }
        });
    }
    console.log(res);
});

router.get("/busqueda_custom_res", function (req, res) {

    //Conectar con la base de datos
    mongoose.connect("mongodb://localhost:27017/testpti", {useNewUrlParser: true});

    //Import informe model
    let Informe = require('../models/informe_model.js');

    Informe.find( function(err, informes){
        if(err){
            console.log(err);
            res.send(500);
        }
        else{
            res.status(200).render('busqueda_custom_res', {informes: informes});
            console.log(res);
        }
    });
});


router.get("/localizaciones", function (req, res) {
    res.render('todas_localizaciones');
    console.log(res);
});

router.get("/pasarValores", function (req, res) {
    res.render('pasarValores', {Title : "Esto es un valor"});
});

router.get("/copiar_pegar", function (req, res) {

    // //Conectar con la base de datos
    mongoose.connect("mongodb://localhost:27017/testpti", {useNewUrlParser: true});

    // //Import empresa model
    let Empresa = require('../models/empresa_model.js');

    Empresa.find( function(err, empresas){
        if(err){
            console.log(err);
            res.send(500);
        }
        else{
            res.status(200).render('copiar_pegar', {empresas: empresas});
            console.log(res);
        }
    });
});


// router.get("/", function (req, res) {
//     res.sendFile(path.join(ruta, '/src/views/ejhtml.html'));
// });

//Modulo disponible
module.exports = router;
