//Servidor principal

/* Se divide en routes (mini-aplicaciones)
* para separar el código
*/

const express = require('express')
const path = require("path");

/* Aplicación principal */
const app = express();
const port = 8080; 
//Configuraciones vistas
app.set('view engine' , 'ejs');
app.set('views', path.join(__dirname, 'views'));
//Configuración archivos acedidos desde el navegador ej CSS, imagenes, videos, iconos
app.use(express.static(path.join(__dirname, 'public')));


/* Middlewares, funciones generales que se ejecutan antes de las rutas */


/* Codigo app principal */
//
//

/* Definimos los modulos y su ubicación */
app.use('/tests', require('./routes/tests'));
app.use('/bd',  require('./routes/bd'));
app.use('/raspberry',  require('./routes/raspberry'));
app.use('/',  require('./routes/web'));

app.listen(port, () => {
    console.log(`HTTP Server listening at http://localhost:${port}`)
})
