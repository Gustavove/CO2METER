//Modulo de base de datos

var express = require('express');

//Creamos variable route (funciona igual que app)
var router = express.Router();

router.get('/', function(req, res) {
    res.send('Ejemplo de GET');
});

router.post('/', function(req, res) {
    res.send('Ejemplo de POST');
});

//Modulo disponible
module.exports = router;