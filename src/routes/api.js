//Modulo para la comunicación con los sensores

const express = require('express');

const methodOverride = require("method-override");
const mongoose = require("mongoose");

//Creamos variable route (funciona igual que app)
const router = express.Router();

//Permite obtener JSON y formularios en peticiones POST
router.use(express.urlencoded({extended: false }));
router.use(express.json());

//Permite hacer PUT y DELETE
router.use(methodOverride());

/* Data Base */

//Connect to mongodb server and search co2meter database, if it does not exists then its created
mongoose.connect("mongodb://localhost:27017/testpti", {useNewUrlParser: true});

//Importamos modelo bd
var Informe = require('../models/informe_model.js');

/* Middlewares, funciones generales que se ejecutan antes de las rutas */


/* Funciones */

function getDate() {
    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth() + 1 //Se suma 1 porque enero esta en 0 (es un array)
    let year = date.getFullYear()

    let result;
    if(month < 10){
        result = `${day}-0${month}-${year}`;
    }else{
        result =`${day}-${month}-${year}`;
    }
    return result;
}

function getHour() {
    var currentTime = Date.now()
    var GMT = -(new Date()).getTimezoneOffset()/60; //Tiene en cuenta la zona horaria
    var totalSeconds = Math.floor(currentTime/1000);
    seconds = ('0' + totalSeconds % 60).slice(-2);
    var totalMinutes = Math.floor(totalSeconds/60);
    minutes = ('0' + totalMinutes % 60).slice(-2);
    var totalHours = Math.floor(totalMinutes/60);
    hours = ('0' + (totalHours+GMT) % 24).slice(-2);

    return hours + ":" + minutes + ":" + seconds;
}



/**
 * "Content-Type", "application/x-www-form-urlencoded"
 * @param req.body.idplaca             ID de la placa
 * @param req.body.particulasCO2       Información de las particulas
 * @param req.body.latitud             Información de la latitud GPS
 * @param req.body.longitud            Información de la longitud GPS
 *
 */
router.post('/', function(req, res) {
    // || permite obtener "" si lo que se recibe es null
    let idplaca = req.body.idplaca || '';
    let particulasCO2 =  req.body.particulasCO2 || '';
    let latitud = req.body.latitud || '';
    let longitud = req.body.longitud || '';

    //Si funciona https con las placas se prueba, sino eliminar
    const certificate = req.socket.getPeerCertificate();

    console.log("ID placa: " + idplaca);
    console.log("Particulas: " + particulasCO2);
    console.log("Latitud:" + latitud);
    console.log("Longitud: " + longitud);

    //Hash_certificado, nombre localización, nombre población,
    const nuevo_informe = new Informe({
        id_placa: idplaca,
        hash_certificado: "MIICAzCCAamgAwIBAgIRALGgWGW1qhPhWg1zWuQ2ZDEwCgYIKoZIzj0EAwIwIzEh\nMB8GA1UEAxMYY28ybWV0ZXIgSW50ZXJtZWRpYXRlIENBMB4XDTIxMTExNzIxNTg1\nNVoXDTIyMDExNzE3NTk1NVowDzENMAsGA1UEAxMETG9SYTBZMBMGByqGSM49AgEG\nCCqGSM49AwEHA0IABLSBF/vdQVKrAefcaSm/FEZHtV96Z9eGyG5CAFlNaDT2IVjY\nEk5XLyaqhHNRR3Dt+Ao4e+h9SFBQrECBu6rNTR+jgdEwgc4wDgYDVR0PAQH/BAQD\nAgeAMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAdBgNVHQ4EFgQUCPtS\nH4Mi4p8FLCBKu9Q7ypOQDW0wHwYDVR0jBBgwFoAUU8kTMQg1MUP8DL+PxsCj1nK7\n0bowDwYDVR0RBAgwBoIETG9SYTBMBgwrBgEEAYKkZMYoQAEEPDA6AgECBA9hdXRo\nb3JpdHktYWRtaW4EJDA5MDM5ZTcwLTJkNWMtNDJiNC1hYzFkLWMwYmUyYjA1ZWIz\nNDAKBggqhkjOPQQDAgNIADBFAiEAxL22zOk282X0D2wU1ZLdRdlOOmWYxk/n+NNJ\nE/6/NIUCIAT7z2EeBrtUiOLJddPEY30wG1fRVnbsTvQeKsPZm1ME",
        nombre_localizacion: "FIB",
        nombre_poblacion: "Barcelona",
        coordenadas_longitud_placa: longitud,
        coordenadas_latitud_placa: latitud,
        datos_co2: particulasCO2,
        fecha_transaccion: getDate(),
        hora_transaccion: getHour(),
        hash_transaccion: "39f6b39c2221f1794c5d2f9ee03b0bbcf3174e9e0bc55a7168f5a4c53c87a956"
    });

    //Buscar informe con mismo id_placa, coordenadas_longitud_placa, coordenadas_latitud_placa, datos_co2 si existe no insertar
    nuevo_informe.save(function(err, nuevo_informe){
        if(err){
            console.log(err);
            res.status(500);
            res.end();
        }
        else{
            //temporal
            res.json({"ID placa": idplaca, "Particulas": particulasCO2, "Latitud": latitud, "Longitud": longitud});

            res.status(201);
            res.end();
        }
    });
});

//Modulo disponible
module.exports = router;