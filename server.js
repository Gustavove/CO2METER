//Servidor principal

/* Se divide en routes (mini-aplicaciones)
* para separar el código
* */

var express = require('express'),
    bd    = require('./routes/bd'),
    tests = require('./routes/tests'),
    port = 8080;

//Aplicación principal
var app = express();

/* Codigo app principal */
//
//

/* Definimos los modulos */
app.use('/tests', tests);
app.use('/bd',  bd);

app.listen(port, () => {
    console.log(`HTTP Server listening at http://localhost:${port}`)
})
