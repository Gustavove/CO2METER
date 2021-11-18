//Servidor principal

/* Se divide en routes (mini-aplicaciones)
* para separar el código
*/

const express = ruire('express');
const path = require("path");
const fs = require('fs');
const https = require('https');
const http = require('http');

let options = {
    cert: fs.readFileSync(path.join(__dirname, '/certificados/server/server.crt')),
    key: fs.readFileSync(path.join(__dirname, '/certificados/server/server.key')),
    requestCert: true,
    //rejectUnauthorized por ahora es false porque queremos contestar a los clientes sin autorización
    rejectUnauthorized: false,
    ca: fs.readFileSync(path.join(__dirname, '/certificados/ca.crt')),
};


/* Aplicación principal */
const app = express();
//Configuraciones vistas
app.set('view engine' , 'ejs');
app.set('views', path.join(__dirname, '/src/views'));
//Configuración archivos acedidos desde el navegador ej CSS, imagenes, videos, iconos
app.use(express.static(path.join(__dirname, '/src/public')));

/* Middlewares, funciones generales que se ejecutan antes de las rutas */
//Envia mensaje de error en caso que el cliente no proporcione certificado válido
const clientAuthMiddleware = () => (req, res, next) => {
    let protocol = req.connection.encrypted ? 'https' : 'http';
    protocol = protocol.split(/\s*,\s*/)[0];
    if (!req.client.authorized && protocol === "https") {
        return res.status(401).send('Invalid client certificate authentication.');
    }
    return next();
};

/* Codigo app principal */
http.createServer(app).listen(8000);
https.createServer(options, app).listen(9000);

/* Definimos los modulos y su ubicación, el orden importa */
app.use(clientAuthMiddleware());
app.use('/tests', require('./src/routes/tests'));
app.use('/bd',  require('./src/routes/bd'));
app.use('/api',  require('./src/routes/api'));
app.use('/',  require('./src/routes/web'));
