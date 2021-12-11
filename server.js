//Servidor principal

/* Se divide en routes (mini-aplicaciones)
* para separar el código
*/

const express = require('express');
const path = require("path");

/* Aplicación principal */
const app = express();
//Configuraciones vistas
app.set('view engine' , 'ejs');
app.set('views', path.join(__dirname, '/src/views'));
//Configuración archivos acedidos desde el navegador ej CSS, imagenes, videos, iconos
app.use(express.static(path.join(__dirname, '/src/public')));

/* Middlewares, funciones generales que se ejecutan antes de las rutas */

app.listen(8000, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", 8000);
})

app.use('/tests', require('./src/routes/tests'));
app.use('/bd',  require('./src/routes/bd'));
app.use('/api',  require('./src/routes/api'));
app.use('/',  require('./src/routes/web'));
