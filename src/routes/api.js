//Modulo para la comunicación con los sensores
const express = require('express');
const axios = require('axios');

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
let Informe = require('../models/informe_model.js');
let Instalacion = require('../models/instalacion_model.js');

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
    let currentTime = Date.now()
    let GMT = -(new Date()).getTimezoneOffset()/60; //Tiene en cuenta la zona horaria
    let totalSeconds = Math.floor(currentTime/1000);
    let seconds = ('0' + totalSeconds % 60).slice(-2);
    let totalMinutes = Math.floor(totalSeconds/60);
    let minutes = ('0' + totalMinutes % 60).slice(-2);
    let totalHours = Math.floor(totalMinutes/60);
    //Horario de invierno se le suma 1
    let hours = ('0' + (totalHours + GMT + 1) % 24).slice(-2);

    return hours + ":" + minutes + ":" + seconds;
}

async function getPoblacion(latitude, longitude) {

    return await axios.get( 'https://nominatim.openstreetmap.org/reverse', {
        params: {
            format: 'jsonv2',
            lat: latitude,
            lon: longitude,
            zoom: 10
        }
    }).then(function (response) {
            if(response.data.error){
                return "No encontrado";
            } else if(response.data.name){
                return response.data.name;
            } else{
                return "No encontrado";
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

async function getLocalizacion(id_placa) {
    return await Instalacion.find({id_placa: id_placa}).exec();
}

/**
 * "Content-Type", "application/x-www-form-urlencoded"
 * @param req.body.idplaca             ID de la placa
 * @param req.body.particulasCO2       Información de las particulas
 * @param req.body.latitud             Información de la latitud GPS
 * @param req.body.longitud            Información de la longitud GPS
 *
 */
router.post('/', async function(req, res) {
        //Al ser Axios asyncrono usaremos todo el POST como asyncrono

        // || permite obtener "" si lo que se recibe es null
        let idplaca = req.body.idplaca || '';
        let particulasCO2 =  req.body.particulasCO2 || '';
        let latitud = req.body.latitud || '';
        let longitud = req.body.longitud || '';

        console.log("Id placa: " + idplaca);
        console.log("Particulas: " + particulasCO2);
        console.log("Latitud: " + latitud);
        console.log("Longitud: " + longitud);
        console.log("");

        //Obtenemos población
        let poblacion = await getPoblacion(latitud, longitud);

        //Obtenemos fecha
        let date = getDate();

        //Obtenemos hora
        let hour = getHour();

        try {
            let instalacion = await getLocalizacion(idplaca);

            //Obtenemos hash de la base de datos
            let hash = require("crypto")
                .createHash("sha256")
                .update(idplaca + "," + instalacion[0].nombre_localizacion + "," + poblacion + "," + longitud + "," + latitud + "," + particulasCO2 + "," + date + "," + hour)
                .digest("hex");

            const nuevo_informe = new Informe({
                id_placa: idplaca,
                nombre_localizacion: instalacion[0].nombre_localizacion,
                nombre_poblacion: poblacion,
                coordenadas_longitud_placa: longitud,
                coordenadas_latitud_placa: latitud,
                datos_co2: particulasCO2,
                fecha_transaccion: date,
                hora_transaccion: hour,
                hash_transaccion: hash
            });

            //Buscar informe con mismo id_placa, coordenadas_longitud_placa, coordenadas_latitud_placa, datos_co2 si existe no insertar
            nuevo_informe.save(function (err, nuevo_informe) {
                if (err) {
                    console.log(err);
                    res.status(500);
                    res.end();
                } else {
                    res.json({
                        "ID placa": idplaca,
                        "Particulas": particulasCO2,
                        "Latitud": latitud,
                        "Longitud": longitud
                    });
                    res.status(201);
                    res.end();
                }
            });

        } catch (e) {
            console.log(e);
            res.status(400);
            res.end();
        }
});

//Modulo disponible
module.exports = router;