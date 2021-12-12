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

/* Codigo app principal */
app.listen(8000, () => {
    console.log("Servidor corriendo por el puerto:", 8000);
});

app.use('/api',  require('./src/routes/api'));
app.use('/',  require('./src/routes/web'));
