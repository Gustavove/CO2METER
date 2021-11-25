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
mongoose.connect("mongodb:pti:alumne//localhost:27017/testpti", {useNewUrlParser: true});

//Schema of the data we are going to save in our database
const informeSchema = new mongoose.Schema({
    id_placa: {
        type: Number,
        min: [0, 'El id de la placa tiene que ser mayor o igual a 0'],
        required: [true, 'Id no especificado']
    },
    hash_certificado: {
        type: String,
        required: [true, 'Hash del certificado no especificado']
    },
    nombre_localizacion: {
        type: String,
        required: [true, 'Nombre de la localizacion no especificado']
    },
    nombre_poblacion: {
        type: String,
        required: [true, 'Nombre de la poblacion no especificado']
    },
    coordenadas_longitud_placa: {
        type: Number,
        required: [true, 'Longitud de coordenadas no especificada']
    },
    coordenadas_latitud_placa: {
        type: Number,
        required: [true, 'Latitud de coordenadas no especificada']
    },
    datos_co2: {
        type: Number,
        required: [true, 'Datos de contaminacion no especificados']
    },
    fecha_transaccion: {
        type: String,
        required: [true, 'Fecha de transaccion no especificada']
    },
    hora_transaccion: {
        type: String,
        required: [true, 'Hora de transaccion no especificada']
    },
    hash_transaccion: {
        type: String,
        required: [true, 'Hora de transaccion no especificada']
    }
});

//Create a mongoose model that will contain all the informeSchema created
const Informe = mongoose.model("Informe", informeSchema);


router.get('/', function(req, res) {
    res.send('Ejemplo de GET');
});

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

    console.log("ID placa: " + idplaca);
    console.log("Particulas: " + particulasCO2);
    console.log("Latitud:" + latitud);
    console.log("Longitud: " + longitud);

    const nuevo_informe = new Informe({
        id_placa: idplaca,
        hash_certificado: req.body.hash_certificado,
        nombre_localizacion: req.body.nombre_localizacion,
        nombre_poblacion: req.body.nombre_poblacion,
        coordenadas_longitud_placa: longitud,
        coordenadas_latitud_placa: latitud,
        datos_co2: particulasCO2,
        fecha_transaccion: req.body.fecha_transaccion,
        hora_transaccion: req.body.hora_transaccion,
        hash_transaccion: req.body.hash_transaccion
    });
    //Buscar informe con mismo id_placa, coordenadas_longitud_placa, coordenadas_latitud_placa, datos_co2 si existe no insertar
    nuevo_informe.save(function(err, nuevo_informe){
        if(err){
            console.log(err);
        }
        else{
            res.send("Nuevo informe insertado correctamente");
        }
    });

    res.json({"ID placa": idplaca, "Particulas": particulasCO2, "Latitud": latitud, "Longitud": longitud});
    res.status(201);
    res.end();
});

//Modulo disponible
module.exports = router;