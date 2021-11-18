//Modulo para la comunicación con los sensores

const express = require('express');

const methodOverride = require("method-override");

//Creamos variable route (funciona igual que app)
const router = express.Router();

//Permite obtener JSON y formularios en peticiones POST
router.use(express.urlencoded({extended: false }));
router.use(express.json());
//Permite hacer PUT y DELETE
router.use(methodOverride());

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

    res.json({"ID placa": idplaca, "Particulas": particulasCO2, "Latitud": latitud, "Longitud": longitud});
    res.status(201);
    res.end();
});

//Modulo disponible
module.exports = router;